import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategotyModule } from '../categoty/categoty.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategotyModule,
    // config ảnh
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Thư mục lưu file
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // Lấy đuôi file (ví dụ: .jpg)
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`; // Tạo tên file duy nhất
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Chỉ cho phép upload file ảnh
        // if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        //   return callback(new Error('Only image files are allowed!'), false);
        // }
        // callback(null, true);
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExtension = extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file (5MB)
      },
    }),
  ],

  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule { }
