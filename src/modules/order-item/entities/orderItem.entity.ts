import { Order } from "src/modules/order/entities/order.entiy";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column()
    price: number

    @ManyToOne(() => Product, (product) => product.orderItems)
    @JoinColumn({ name: 'productId' })
    product: Product

    @ManyToOne(() => Order, (order) => order.orderItems)
    @JoinColumn({ name: 'orderId' })
    order: Order
}