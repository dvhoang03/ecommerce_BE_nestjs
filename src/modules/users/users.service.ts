import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from '../cart/cart.service';
import { Order } from '../order/entities/order.entiy';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const u = await this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(u);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException(" not find user ")
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    var user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("not find product");
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException("no found user ");
    }
    const orders = await this.orderRepository.find({
      where: {
        user: user
      }
    })
    if (!orders) {
      throw new BadRequestException("not remove user because user have order")
    }
    return await this.userRepository.delete(id);
  }

  async findBy(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

}
