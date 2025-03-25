import { Order } from "src/modules/order/entities/order.entiy";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Voucher{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    code: string

    @Column()
    discount: string

    @Column()
    expiryDate: Date

    @Column()
    stock: number

    @OneToMany( () => Order, (order) => order.voucher)
    orders: Order[]

}