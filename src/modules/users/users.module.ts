import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CartModule } from '../cart/cart.module';
import { Order } from '../order/entities/order.entiy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order]),
    CartModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
