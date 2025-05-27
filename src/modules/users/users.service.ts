import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entiy';
import { ClsService } from 'nestjs-cls';
import { Cart } from '../cart/entities/cart.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Order>,
    private readonly cls: ClsService,
  ) {
    super(userRepository);
  }

  async findOne(id: number): Promise<User> {
    const entity = await this.repository.findOneBy({ id }); // Sử dụng 'as any' tạm thời để tránh lỗi kiểu
    if (!entity) {
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }
    return entity;
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  // tim user qua email
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  //check xem user cos order khong
  async hasOrders(userId: number): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('khong tim thay user');
    }
    return (await this.orderRepository.findOne({ where: { user } }))
      ? true
      : false;
  }

  //check xem user cos cart khong
  async hasCart(userId: number): Promise<boolean> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('khong tim thay user');
    }
    return (await this.cartRepository.findOne({ where: { user } }))
      ? true
      : false;
  }
}
