import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDTO } from './dto/updateproduct.dto';
import { CreateProductDTO } from './dto/product.dto';
import { Category } from '../categoty/entities/category.entity';
import { CategotyService } from '../categoty/categoty.service';
@Injectable()
export class ProductService {
    
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private categoryService: CategotyService
    ){}

    async getAll(): Promise<Product[]>{
        return this.productRepository.find({
            relations: ['category']
        });
    }

    async getDetail(id: number):Promise<Product | null> {
        const pro = this.productRepository.findOne({
            where:{id},
            relations: ['category'],
        });
        if(!pro){
            throw new NotFoundException(`Product id = ${id} ot found`);
        }
        return pro;
    }

    async createPorduct( pro: CreateProductDTO): Promise<Product>{
        
        const category = await this.categoryService.getDetail(pro.categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        const product = await this.productRepository.create({
            category,
            ...pro
        });

        return await this.productRepository.save(product);
    }

    async updatePorduct( pro: UpdateProductDTO, id : number): Promise<Product | null>{
        const product = await this.productRepository.findOne({where:{id}});
        if( !product){
            throw new NotFoundException(`Product id = ${id} ot found`);
        }
        await this.productRepository.update(id,pro);
        return await this.productRepository.findOneBy({id});
    }

    async delete(id: number){
        return await this.productRepository.delete(id);
    }
}
