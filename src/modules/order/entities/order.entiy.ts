import { onErrorResumeNext } from "rxjs";
import { OrderItem } from "src/modules/order-item/entities/orderItem.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Voucher } from "src/modules/voucher/entites/voucher.entites";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    total: number

    @Column()
    status: string

    @ManyToOne(() => Voucher, (voucher) => voucher.orders, {nullable: true})
    voucher: Voucher

    @ManyToOne( () => User, (user) => user.orders)
    user: User

    @OneToMany( () => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[]
}