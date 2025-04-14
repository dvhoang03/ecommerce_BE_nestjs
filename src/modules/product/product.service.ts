// src/modules/product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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



@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private categoryService: CategotyService,
        private minioService: MinioService,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,
    ) {
        super(productRepository);
    }

    async getFilteredProducts(
        categoryId?: number,
        minPrice?: number,
        maxPrice?: number,
        search?: string,
        pageSize?: number,
        page?: number,
    ): Promise<Product[]> {


        // Truy vấn và trả về kết quả
        return await this.productRepository.find();
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id }
        });
        if (!product) {
            throw new NotFoundException(`Product id = ${id} not found`);
        }
        return product;
    }

    async create(pro: CreateProductDTO, files: Express.Multer.File[]): Promise<Product> {
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
                var imageUrl = await this.minioService.uploadImage(file.originalname, file.buffer);
                imageUrls.push(imageUrl);
            }
            product.images = imageUrls;
        }

        return await this.productRepository.save(product);
    }

    async update(id: number, pro: UpdateProductDTO, files: Express.Multer.File[]): Promise<Product> {
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
                const imageUrl = await this.minioService.uploadImage(file.originalname, file.buffer);
                imageUrls.push(imageUrl); // Thêm URL ảnh vào danh sách
            }
            product.images = imageUrls;
        }

        // Lưu sản phẩm đã cập nhật
        await this.productRepository.save(product);
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
        return deleteProduct.affected === 1 ? true : false;
    }

    async hasOrderOrCartItem(productId: number): Promise<boolean> {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException("khong tim thay product")
        }
        const { id, name, price, stock } = product
        const cartItem = await this.cartItemRepository.findOne({
            where: {
                product:
                {
                    id: id,
                    name: name,
                    price: price,
                    stock: stock,
                }
            },
            relations: ['product']
        })
        const orderItem = await this.orderItemRepository.findOne({
            where: {
                product:
                {
                    id: id,
                    name: name,
                    price: price,
                    stock: stock,
                }
            },
        })
        return (cartItem || orderItem) ? true : false;
    }

    async IsValidProductQuantity(productId: number, valueQuantity: number): Promise<boolean> {
        const product = await this.findOne(productId);
        return ((product.stock) - valueQuantity >= 0) ? true : false;
    }
}