import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cartItem.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';
import { CreateCartItemDTO, UpdateCartItemDTO } from './dto/cartItem.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartItemService {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        private cartService: CartService,
        private productService: ProductService,
    ) { }

    //lay tat car cartitem
    async getAll(userId: number): Promise<CartItem[]> {
        const cart = await this.cartService.findbyUserId(userId);
        if (!cart) {
            throw new NotFoundException("not found cart of user")
        }
        return await this.cartItemRepository.find({
            where: { cart },
            relations: ['product']
        })
    }

    async getDetail(id: number): Promise<CartItem> {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id }
        })
        if (!cartItem) {
            throw new NotFoundException("not found cartItem")
        }
        return cartItem
    }


    //tao cartItem neu quantity > product.stock thi huy
    async createCartItem(userId: number, cartItemDTO: CreateCartItemDTO): Promise<CartItem> {
        var cart = await this.cartService.findbyUserId(userId);
        if (!cart) {
            cart = await this.cartService.createCart(userId);
        }
        let { quantity, productId } = cartItemDTO;
        const product = await this.productService.getDetail(productId);
        if (!product) {
            throw new NotFoundException("not found product of cartitem")
        }
        const cartitem = await this.cartItemRepository.findOne({
            where: { cart, product }
        })
        if (cartitem) {
            quantity = quantity + cartitem.quantity
        }
        if (quantity > product.stock) {
            throw new BadRequestException("quantity of product or enought")
        }
        const cartItem = await this.cartItemRepository.create({
            quantity,
            product,
            cart
        })
        return this.cartItemRepository.save(cartItem)
    }

    async updateCartItem(userId: number, id: number, updateCartItemDTO: UpdateCartItemDTO): Promise<any> {

        const { quantity } = updateCartItemDTO;
        var cartitem = await this.cartItemRepository.findOne({ where: { id } });
        if (!cartitem) {
            throw (" ko tim thay cartItem");
        }

        if (quantity > cartitem.product.stock) {
            throw new BadRequestException("quantity over quantity of product")
        }
        return await this.cartItemRepository.update(id, {
            quantity
        })
    }

    async deleteCartItem(id: number): Promise<any> {

        var cartitem = await this.cartItemRepository.findOne({ where: { id } });
        if (!cartitem) {
            throw (" ko tim thay cartItem");
        }

        return await this.cartItemRepository.delete(id);
    }
}
