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

@Module({
  imports: [TypeOrmModule.forFeature([Order, CartItem, Product, OrderItem]),
    OrderItemModule,
    VoucherModule,
    CartItemModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, IsValidQuantityValidator, IsValidVoucherCodeValidator, IsDeleteOrderValidator],
  exports: [OrderService],
})
export class OrderModule { }
