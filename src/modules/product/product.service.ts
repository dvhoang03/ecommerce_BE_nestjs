// src/modules/product/product.service.ts
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

import { CreateProductDTO } from './dto/createProduct.dto';
import { Category } from '../categoty/entities/category.entity';
import { CategotyService } from '../categoty/categoty.service';
import { join } from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { MinioService } from '../minio/minio.service';
import { CartItem } from '../cart-item/entities/cartItem.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { UpdateProductDTO } from './dto/updateProduct.dto';
import { BaseService } from '../base/base.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService extends BaseService<Product> {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private categoryService: CategotyService,
    private minioService: MinioService,
  ) {
    super(productRepository);
  }

  async getFilteredProducts(
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Product[]> {
    const cacheKey = `products:${categoryId ?? ''}:${minPrice ?? ''}:${maxPrice ?? ''}:${search ?? ''}:${page}:${pageSize}`;
    const cacheProduct = await this.cacheManager.get<Product[]>(cacheKey);

    if (cacheProduct) {
      this.logger.log('Returning cached products');
      return cacheProduct;
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (search) {
      queryBuilder.andWhere('product.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Pagination
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    const products = await queryBuilder.getMany();
    // Lưu vào cache Redis
    await this.cacheManager.set(cacheKey, products, 10000);

    this.logger.log('Returning fresh products and caching them');
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const valueKey = `productId:${id}`;
    const cacheProduct = await this.cacheManager.get<Product>(valueKey);
    if (cacheProduct) {
      this.logger.log('Returning cached product');
      return cacheProduct;
    }
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product id = ${id} not found`);
    }
    await this.cacheManager.set(valueKey, product);
    return product;
  }

  async create(
    pro: CreateProductDTO,
    files: Express.Multer.File[],
  ): Promise<Product> {
    // Kiểm tra sự tồn tại của danh mục
    const category = await this.categoryService.findOne(pro.categoryId);

    // Khởi tạo đối tượng sản phẩm mới
    const product = this.productRepository.create({
      category,
      ...pro,
      images: [], // Khởi tạo mảng images rỗng
    });

    // Xử lý file ảnh (tải ảnh lên MinIO)
    if (files && files.length > 0) {
      const imageUrls: string[] = [];
      for (const file of files) {
        // Tải ảnh lên MinIO và lấy URL
        const imageUrl = await this.minioService.uploadImage(
          file.originalname,
          file.buffer,
        );
        imageUrls.push(imageUrl);
      }
      product.images = imageUrls;
    }

    await this.cacheManager.del('products:*');

    return await this.productRepository.save(product);
  }

  async update(
    id: number,
    pro: UpdateProductDTO,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product id = ${id} not found`);
    }

    // Cập nhật các trường nếu có trong DTO
    if (pro.name) product.name = pro.name;
    if (pro.price) product.price = pro.price;
    if (pro.stock) product.stock = pro.stock;
    if (pro.categoryId) {
      const category = await this.categoryService.findOne(pro.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }

    // Xử lý cập nhật ảnh
    if (files && files.length > 0) {
      // Xóa các file ảnh cũ (nếu có)
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          const fileName = imageUrl.split('/').pop() || '';
          try {
            await this.minioService.deleteImage(fileName); // Xóa ảnh khỏi MinIO
          } catch (err) {
            console.error(`Failed to delete file from MinIO:`, err);
          }
        }
      }

      // Lưu các ảnh mới
      const imageUrls: string[] = [];
      for (const file of files) {
        const imageUrl = await this.minioService.uploadImage(
          file.originalname,
          file.buffer,
        );
        imageUrls.push(imageUrl); // Thêm URL ảnh vào danh sách
      }
      product.images = imageUrls;
    }

    // Lưu sản phẩm đã cập nhật
    await this.productRepository.save(product);
    await this.cacheManager.del('products:*');
    return product;
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product id = ${id} not found`);
    }

    // Xóa các file ảnh (nếu có)
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const fileName = imageUrl.split('/').pop() || '';
        try {
          await this.minioService.deleteImage(fileName); // Xóa ảnh khỏi MinIO
        } catch (err) {
          console.error(`Failed to delete file from MinIO:`, err);
        }
      }
    }

    const deleteProduct = await this.productRepository.delete(id);
    await this.cacheManager.del(`products:${id}`);
    const valueKey = `productId:${id}`;
    await this.cacheManager.del(valueKey);
    return deleteProduct.affected === 1 ? true : false;
  }

  async hasOrderOrCartItem(productId: number): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('khong tim thay product');
    }
    const { id, name, price, stock } = product;
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        product: {
          id: id,
          name: name,
          price: price,
          stock: stock,
        },
      },
      relations: ['product'],
    });
    const orderItem = await this.orderItemRepository.findOne({
      where: {
        product: {
          id: id,
          name: name,
          price: price,
          stock: stock,
        },
      },
    });
    return cartItem || orderItem ? true : false;
  }

  async IsValidProductQuantity(
    productId: number,
    valueQuantity: number,
  ): Promise<boolean> {
    const product = await this.findOne(productId);
    return product.stock - valueQuantity >= 0 ? true : false;
  }
}
