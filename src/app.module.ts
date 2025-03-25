import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

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

console.log(process.env.DB_HOST)
@Module({
  imports: [
    ConfigModule.forRoot(//config file env
      {
        isGlobal:true
      }
    ),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CategotyModule,
    ProductModule,
    VoucherModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
  ],
  
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule implements NestModule {
  constructor( private datasource: DataSource){};

  configure(consumer: MiddlewareConsumer) {//config middleware 
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('');
  }
}
