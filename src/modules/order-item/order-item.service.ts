import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { OrderItemDTO } from './dto/orderItem.dto';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entiy';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>
    ) { }

    async createOrderItem(orderItem: OrderItemDTO, price: number, product: Product, order: Order): Promise<OrderItem> {
        const oi = await this.orderItemRepository.create({
            product,
            order,
            price,
            ...orderItem
        })
        return await this.orderItemRepository.save(oi);
    }

    async deleteOrderItemByOrder(order: Order) {
        return this.orderItemRepository.delete(order);
    }
}
