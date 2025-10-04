import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategotyModule } from '../categoty/categoty.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MinioModule } from '../minio/minio.module';
import { IsHasOrderItemOrCartItemValidator } from 'src/validationAndPipes/validation/IsDeleteProduct';
import { CartItem } from '../cart-item/entities/cartItem.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, CartItem, OrderItem]),

    // config ảnh
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads', // Thư mục lưu file
    //     filename: (req, file, callback) => {
    //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //       const ext = extname(file.originalname);
    //       const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    //       callback(null, filename);
    //     },
    //   }),
    //   fileFilter: (req, file, callback) => {
    //     if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    //       return callback(new Error('Only image files are allowed!'), false);
    //     }
    //     callback(null, true);
    //   },
    //   limits: {
    //     fileSize: 5 * 1024 * 1024, // 5MB
    //   },
    // }),

    CategotyModule,
    MinioModule,
  ],

  controllers: [ProductController],
  providers: [ProductService, IsHasOrderItemOrCartItemValidator],
  exports: [ProductService],
})
export class ProductModule {}
