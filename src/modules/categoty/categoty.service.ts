import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategotyService {

    
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>){};

    async getAll() :Promise<Category[]>{
        return await this.categoryRepository.find();
    }

    async getDetail(id: number): Promise<Category | null>{
        const cate = await this.categoryRepository.findOne({ 
            where:{id},
          });
        if(!cate) throw new NotFoundException(`not find category vs id = ${id}`);
        return cate;
    }

    async createCategory(catogory: CategoryDTO): Promise<Category>{
        const cate = this.categoryRepository.create(catogory);
        return await this.categoryRepository.save(cate);
    }

    async  updateCategory(category: CategoryDTO,  id: number){
        const cate =  await this.categoryRepository.findOne({where:{id}});
        if( !cate){
            throw new NotFoundException(`not find category by ${id}`);
        }
        await this.categoryRepository.update(id, category);
        return await this.categoryRepository.findOne({where:{id}});
    }

    async deleteCategory(id : number): Promise<any>{
        return this.categoryRepository.delete(id);
    }
}
