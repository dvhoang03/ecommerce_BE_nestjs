import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cartItem.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';
import { CreateCartItemDTO, UpdateCartItemDTO } from './dto/cartItem.dto';
import { ProductService } from '../product/product.service';
import { BaseService } from '../base/base.service';

@Injectable()
export class CartItemService extends BaseService<CartItem> {
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        private cartService: CartService,
        private productService: ProductService,
    ) {
        super(cartItemRepository)
    }

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


    //tao cartItem 
    async create(cartItemDTO: CreateCartItemDTO, userId: number): Promise<CartItem> {

        let { productId, quantity } = cartItemDTO;
        // Lấy giỏ hàng của người dùng
        let cart = await this.cartService.findbyUserId(userId);
        // Nếu chưa có giỏ hàng, tạo mới
        if (!cart) {
            cart = await this.cartService.createCart(userId);
        }
        // Lấy chi tiết sản phẩm
        const product = await this.productService.findOne(productId);

        console.log(cart, product)
        // tim cartItem của user cho product
        const cartItem = await this.cartItemRepository.findOne({
            where: {
                product: {
                    id: product.id
                },
                cart: {
                    id: cart.id
                }
            }
        })

        //Nếu đã có, cộng thêm số lượng vào cartItem hiện tại
        if (cartItem) {
            const updateQuantity = quantity + cartItem.quantity;
            await this.cartItemRepository.update(cartItem.id, { quantity: updateQuantity })
            return await this.findOne(cartItem.id);
        }

        // Nếu cartItem chưa tồn tại, tạo một cartItem mới
        const newCartItem = this.cartItemRepository.create({
            quantity,
            product,
            cart,
        });
        return this.cartItemRepository.save(newCartItem);

    }


    async updateCartItem(userId: number, id: number, updateCartItemDTO: UpdateCartItemDTO): Promise<CartItem> {
        const { quantity } = updateCartItemDTO;
        var cartitem = await this.cartItemRepository.findOne({
            where: { id },
            relations: ['product', 'cart']
        });
        if (!cartitem) {
            throw (" ko tim thay cartItem");
        }
        await this.cartItemRepository.update(id, {
            quantity
        })
        return await this.findOne(id);
    }

    async findCartItemByProduct(productId): Promise<CartItem | null> {
        const cartItem = await this.cartItemRepository.findOne({
            where: {
                product: {
                    id: productId
                }
            }
        })

        return cartItem;
    }

}
