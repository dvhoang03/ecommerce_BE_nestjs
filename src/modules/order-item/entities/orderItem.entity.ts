import { Order } from "src/modules/order/entities/order.entiy";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quanlity: number

    @Column()
    price: number

    @ManyToOne(() => Product, (product) => product.orderItems)
    product: Product

    @ManyToOne( () => Order, (order) => order.orderItems)
    order: Order
}