import { Module } from '@nestjs/common';
import { CategotyService } from './categoty.service';
import { CategotyController } from './categoty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategotyController],
  providers: [CategotyService],
  exports: [CategotyService],
})
export class CategotyModule { }
