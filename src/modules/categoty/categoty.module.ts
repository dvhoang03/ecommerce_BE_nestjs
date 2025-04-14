import { Module } from '@nestjs/common';
import { CategotyService } from './categoty.service';
import { CategotyController } from './categoty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { ClsModule } from 'nestjs-cls';
import { IsHasProductsValidator } from 'src/validationAndPipes/validation/isDeleteCategory';

@Module({
     imports: [TypeOrmModule.forFeature([Category, Product]),
          ClsModule,
     ],
     controllers: [CategotyController],
     providers: [CategotyService, IsHasProductsValidator],
     exports: [CategotyService],
})
export class CategotyModule { }
