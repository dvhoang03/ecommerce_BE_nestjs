import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartDTO } from './dto/cat.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepository: Repository<Cart>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { };

    // get all cart
    async getAll(): Promise<Cart[]> {
        return this.cartRepository.find({
            relations: ['user']
        });
    }

    //create cart
    async createCart(userId: number) {

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('not foundUser')
        }
        const cart = await this.cartRepository.create({ user });

        return await this.cartRepository.save(cart);
    }

    // find cart by userId
    async findbyUserId(userId: number): Promise<Cart> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('not found user')
        }
        const cart = await this.cartRepository.findOne({
            where: {
                user: user
            }
        })
        if (!cart) {
            throw new NotFoundException("not found cart by this user")
        }
        return cart;
    }

}
