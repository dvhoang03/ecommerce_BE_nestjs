import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entiy';
import { VoucherModule } from '../voucher/voucher.module';
import { CartModule } from '../cart/cart.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { CartItemModule } from '../cart-item/cart-item.module';
import { ProductModule } from '../product/product.module';
import { CartItem } from '../cart-item/entities/cartItem.entity';
import { Product } from '../product/entities/product.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { IsValidQuantityValidator } from 'src/validationAndPipes/validation/isValidQuantity';
import { IsValidVoucherCodeValidator } from 'src/validationAndPipes/validation/isValidVoucherCode';
import { IsDeleteOrderValidator } from 'src/validationAndPipes/validation/isDeleteOrder';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, CartItem, Product, OrderItem]),
    OrderItemModule,
    VoucherModule,
    CartItemModule,
    ProductModule,

    // config cho  microservice client
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost', // Tên service hoặc IP
          port: 4000,
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    IsValidQuantityValidator,
    IsValidVoucherCodeValidator,
    IsDeleteOrderValidator,
  ],
  exports: [OrderService],
})
export class OrderModule {}
