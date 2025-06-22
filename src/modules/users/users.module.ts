import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CartModule } from '../cart/cart.module';
import { Order } from '../order/entities/order.entiy';
import { ClsModule } from 'nestjs-cls';
import { IsEmailUniqueValidator } from 'src/validationAndPipes/validation/isEmailUnique';
import { Cart } from '../cart/entities/cart.entity';
import {
  IsDeleteUserValidator,
  IsHasOrdersOrCart,
} from 'src/validationAndPipes/validation/isDeleteUser';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Cart]),
    CartModule,
    ClsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, IsEmailUniqueValidator, IsDeleteUserValidator],
  exports: [UsersService],
})
export class UsersModule { }

