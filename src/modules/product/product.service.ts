// src/modules/product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDTO } from './dto/updateproduct.dto';
import { CreateProductDTO } from './dto/product.dto';
import { Category } from '../categoty/entities/category.entity';
import { CategotyService } from '../categoty/categoty.service';
import { join } from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private categoryService: CategotyService,
    ) { }

    async getAll(): Promise<Product[]> {
        return this.productRepository.find({
            relations: ['category'],
        });
    }

    async getDetail(id: number): Promise<Product | null> {
        const pro = await this.productRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!pro) {
            throw new NotFoundException(`Product id = ${id} not found`);
        }
        return pro;
    }

    async createPorduct(pro: CreateProductDTO, files: Express.Multer.File[]): Promise<Product> {
        const category = await this.categoryService.getDetail(pro.categoryId);
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const product = this.productRepository.create({
            category,
            ...pro,
            images: [], // Khởi tạo mảng images rỗng
        });

        // Xử lý file ảnh
        if (files && files.length > 0) {
            const imageUrls = files.map((file) => `/uploads/${file.filename}`);
            product.images = imageUrls;
        }

        return await this.productRepository.save(product);
    }

    async updatePorduct(pro: UpdateProductDTO, id: number, files: Express.Multer.File[]): Promise<Product | null> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product id = ${id} not found`);
        }

        // Cập nhật các trường nếu có trong DTO
        if (pro.name) product.name = pro.name;
        if (pro.price) product.price = pro.price;
        if (pro.stock) product.stock = pro.stock;
        if (pro.categoryId) {
            const category = await this.categoryService.getDetail(pro.categoryId);
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
                    const filePath = join(__dirname, '..', '..', imageUrl);
                    try {
                        await unlinkAsync(filePath);
                    } catch (err) {
                        console.error(`Failed to delete file ${filePath}:`, err);
                    }
                }
            }

            // Lưu các ảnh mới
            const imageUrls = files.map((file) => `/uploads/${file.filename}`);
            product.images = imageUrls;
        }

        // Lưu sản phẩm đã cập nhật
        await this.productRepository.save(product);
        return product;
    }

    async delete(id: number) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product id = ${id} not found`);
        }

        // Xóa các file ảnh (nếu có)
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                const filePath = join(__dirname, '..', '..', imageUrl);
                try {
                    await unlinkAsync(filePath);
                } catch (err) {
                    console.error(`Failed to delete file ${filePath}:`, err);
                }
            }
        }

        return await this.productRepository.delete(id);
    }
}