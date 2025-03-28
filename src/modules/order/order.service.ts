import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entiy';
import { Repository } from 'typeorm';
import { OrderDTO } from './dto/order.dto';
import { VoucherService } from '../voucher/voucher.service';
import { CartItemService } from '../cart-item/cart-item.service';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../cart-item/entities/cartItem.entity';
import { OrderItemService } from '../order-item/order-item.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        private voucherService: VoucherService,
        private cartItemService: CartItemService,
        private orderItemService: OrderItemService,

    ) { }

    async getAll(user: User): Promise<Order[]> {
        return this.orderRepository.find({ where: { user } });
    }

    async getdetail(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['order_item']
        });

        if (!order) {
            throw new NotFoundException("not found order")
        }
        return order;
    }

    async createOrder(orderDTO: OrderDTO, user: User): Promise<Order> {
        const { voucherId, cartItemIds } = orderDTO;

        // Lấy chi tiết voucher nếu có
        const voucher = voucherId ? await this.voucherService.getDetail(voucherId) : undefined;

        // Lấy chi tiết tất cả cart items
        const cartItems: CartItem[] = await Promise.all(
            cartItemIds.map((id) => this.cartItemService.getDetail(id)),
        );

        if (!cartItems || cartItems.length === 0) {
            throw new Error('No valid cart items found.');
        }

        // Tính tổng tiền
        let total = cartItems.reduce((sum, item) => {
            return sum + item.quantity * item.product.price;
        }, 0);

        // Áp dụng giảm giá nếu có voucher
        if (voucher && voucher.discount) {
            const coupon = voucher.discount;
            if (coupon.endsWith('%')) {
                const percent = parseFloat(coupon.slice(0, -1));
                total = total - (total * percent) / 100;
            } else {
                const fixedAmount = parseFloat(coupon);
                total = total - fixedAmount;
            }

            if (total < 0) total = 0; // đảm bảo không âm
        }

        // Tạo Order
        const order = await this.orderRepository.create({
            total,
            user,
            voucher,
        });

        const savedOrder = await this.orderRepository.save(order);

        // // Tạo OrderItems từ cartItems
        const orderItems = cartItems.map((item) => {
            const { quantity, product } = item;
            return this.orderItemService.createOrderItem({ quantity }, quantity * product.price, product, savedOrder)
        });

        // await this.orderItemRepository.save(orderItems);

        return savedOrder;
    }


    async updateStatus(id: number, status: string): Promise<any> {
        return await this.orderRepository.update(id, { status });
    }

    async deleteOrder(id: number) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException("not found order")
        }
        if (order.status !== "pending") {
            throw new BadRequestException("no  cancel order shipped or delivered");
        }

        // xoa orderitem 
        this.orderItemService.deleteOrderItemByOrder(order);

        return this.orderRepository.delete(id);
    }
}
