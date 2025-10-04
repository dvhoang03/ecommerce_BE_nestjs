import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cartItem.entity';
import { UsersModule } from '../users/users.module';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { IsValidQuantityValidator } from 'src/validationAndPipes/validation/isValidQuantity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), CartModule, ProductModule],
  controllers: [CartItemController],
  providers: [CartItemService, IsValidQuantityValidator],
  exports: [CartItemService],
})
export class CartItemModule {}
