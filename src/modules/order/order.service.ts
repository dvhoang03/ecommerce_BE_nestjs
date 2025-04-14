import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entiy';
import { Repository } from 'typeorm';
import { OrderDTO } from './dto/order.dto';
import { VoucherService } from '../voucher/voucher.service';
import { CartItemService } from '../cart-item/cart-item.service';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../cart-item/entities/cartItem.entity';
import { OrderItemService } from '../order-item/order-item.service';
import { Product } from '../product/entities/product.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { CreateDirectOrderDTO } from './dto/createDirectOrder.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
        private voucherService: VoucherService,
        private cartItemService: CartItemService,
        private orderItemService: OrderItemService,

    ) { }

    //lay tat ca order
    async getAll(user: User): Promise<Order[]> {
        return this.orderRepository.find({ where: { user: { id: user.id } } });
    }

    // find  orderItem cuar order bang  orderId
    async getdetailOrder(id: number): Promise<OrderItem[]> {
        const order = await this.findOrderById(id);
        const orderItems = await this.orderItemRepository.find({
            where: { order },
            relations: ['product']
        })
        return orderItems;
    }

    //tim order bang id
    async findOrderById(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id }
        });

        if (!order) {
            throw new NotFoundException(`not found order by id: ${id}`)
        }
        return order;
    }

    // tao order va order item khi request la danh sach cac cartItemId 
    async createOrder(orderDTO: OrderDTO, user: User): Promise<Order> {
        const { code, cartItemIds } = orderDTO;
        // Lấy chi tiết tất cả cart items
        const cartItems: CartItem[] = await Promise.all(
            cartItemIds.map((id) => {
                const cartItem = this.cartItemService.findOne(id)
                return cartItem;
            })
        );
        if (!cartItemIds || cartItems.length === 0) {
            throw new BadRequestException('No valid cart items found.');
        }

        // Tính tổng tiền
        var total = cartItems.reduce((sum, cartItem) => {
            const stock = cartItem.product.stock;
            return sum + cartItem.quantity * cartItem.product.price;
        }, 0);

        // Lấy chi tiết voucher nếu có
        const voucher = code ? await this.voucherService.findVoucherByCode(code) : undefined;
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
        const orderItems = cartItems.map(async (item) => {
            const { id, quantity, product } = item;
            // tru di so luong da dat
            const stock = item.product.stock - quantity;
            const idproduct = item.product.id;
            await this.productRepository.update(idproduct, { stock });
            // tao orderitems
            const orderItem = await this.orderItemService.createOrderItem({ quantity }, quantity * product.price, product, savedOrder)
            // xoa cartitem
            await this.cartItemRepository.delete(id);
        });

        if (voucher) await this.voucherService.subtractVoucher(voucher.id, 1);

        return savedOrder;
    }


    //tao order truwcj tiep tu product
    async createDirectOrder(orderDTO: CreateDirectOrderDTO, user: User): Promise<Order> {
        const { code, productId, quantity } = orderDTO;

        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`khong tim thay product voi id ${productId}`)
        }

        var total = product.price * product.stock;
        // Lấy chi tiết voucher nếu có
        const voucher = code ? await this.voucherService.findVoucherByCode(code) : undefined;
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
        // tao orderitems
        const orderItem = await this.orderItemService.createOrderItem({ quantity }, total, product, savedOrder)

        if (voucher) await this.voucherService.subtractVoucher(voucher.id, 1);

        return savedOrder;
    }

    //update status of order
    async updateStatus(id: number, status: string): Promise<Order | null> {
        console.log(status)
        await this.orderRepository.update(id, { status });
        return this.orderRepository.findOne({ where: { id } })
    }

    // xoa user qua id
    async deleteOrder(id: number) {
        const order = await this.findOrderById(id);

        // xoa orderitem 
        const orderItems = await this.orderItemRepository.find({
            where: {
                order: { id: order.id }
            },
            relations: ['product']
        })

        orderItems.forEach(async (orderItem, index) => {
            const quantity = orderItem.quantity;
            await this.productRepository.update((orderItem.product.id), { stock: orderItem.product.stock + quantity })
        })
        return this.orderRepository.delete(id);
    }



}
