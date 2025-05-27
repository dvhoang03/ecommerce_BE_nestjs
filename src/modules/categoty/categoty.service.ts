import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDTO } from './dto/category.dto';
import { Product } from '../product/entities/product.entity';
import { ClsService } from 'nestjs-cls';
import { BaseService } from '../base/base.service';

@Injectable()
export class CategotyService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(categoryRepository);
  }

  async findOne(id: number): Promise<Category> {
    const entity = await this.repository.findOneBy({ id } as any); // Sử dụng 'as any' tạm thời để tránh lỗi kiểu
    if (!entity) {
      throw new NotFoundException(`Không tìm thấy catofory với ID ${id}`);
    }
    return entity;
  }

  async hasProducts(categoryId: number): Promise<boolean> {
    const category = await this.findOne(categoryId);
    const products = await this.productRepository.findOne({
      where: { category },
    });
    return products ? true : false;
  }
}
