import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entiy';
import { VoucherModule } from '../voucher/voucher.module';
import { CartModule } from '../cart/cart.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { CartItemModule } from '../cart-item/cart-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]),
    OrderItemModule,
    VoucherModule,
    CartItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule { }
