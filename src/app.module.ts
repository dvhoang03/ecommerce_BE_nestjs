import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CategotyModule } from './modules/categoty/categoty.module';
import { ProductModule } from './modules/product/product.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { LoggerMiddleware } from './middleware/loggerMiddleware';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MinioService } from './modules/minio/minio.service';
import { MinioModule } from './modules/minio/minio.module';
import { ClsModule } from 'nestjs-cls';
import { BaseModule } from './modules/base/base.module';
import * as moment from 'moment';
import { CacheModule } from '@nestjs/cache-manager';
import { hostname } from 'os';
import { redisStore } from 'cache-manager-redis-store';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ExcelService } from './modules/excel/excel.service';
import { ExcelModule } from './modules/excel/excel.module';
import { KafkaLoggerModule } from './modules/sendLogKafka/KafkafLogger.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      //config file env
      {
        isGlobal: true,
      },
    ),

    // /config mysql
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      // host: 'mysql',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    // config redis
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (c) => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        ttl: Number(process.env.REDIS_PORT) || 10000,
        // max: configService.get('MAX_ITEM_IN_CACHE')
      }),
    }),

    //config cls
    ClsModule.forRoot({
      middleware: {
        // tu dong gan middleware cho moi tuyen duowng
        mount: true,
        // su dung phuong thuc setup de cung cap gia tri mac dinhj cho store
        setup: (cls, req) => {
          // console.log('Header x-user-id:', req);
          // console.log('Header x-user-id:', req.headers);
          cls.set('userId', req.headers.authorization);
        },
      },
    }),

    // config multer doc file
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: (req, file, cb) => {
    //       const uniqueSufix = Date.now() + '-' + Math.round(Math.random() + 1e9);
    //       cb(null, `${file.fieldname}-${uniqueSufix}.xlxs`);
    //     }
    //   }),
    //   fileFilter: (req, file, callback) => {
    //     // Validate định dạng file (chỉ cho phép ảnh)
    //     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    //     if (!allowedTypes.includes(file.mimetype)) {
    //       return callback(new Error('Just allow file image (JPG, PNG, GIF)'), false);
    //     }
    //     //// Validate kích thước file
    //     const maxSize = 5 * 1024 * 1024; //5mb
    //     if (file.size > maxSize) {
    //       return callback(new Error('Image file over 5mb'), false);
    //     }
    //     callback(null, true);
    //   },
    // }),

    UsersModule,
    AuthModule,
    CategotyModule,
    ProductModule,
    VoucherModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    MinioModule,
    BaseModule,
    ExcelModule,
    KafkaLoggerModule,
  ],

  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    MinioService,
  ],
  exports: [],
})
export class AppModule implements NestModule {
  constructor(private datasource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    //config middleware
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
