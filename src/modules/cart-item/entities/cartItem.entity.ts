import { Cart } from "src/modules/cart/entities/cart.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CartItem{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quanlity: number

    @ManyToOne( ()=> Product, (product) => product.cartItems)
    product:  Product

    @ManyToOne( () => Cart, (cart) => cart.cartItems)
    @JoinColumn()
    cart: Cart
}