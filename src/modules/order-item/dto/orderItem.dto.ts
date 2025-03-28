import { IsInt, IsNotEmpty, Min } from "class-validator";

export class OrderItemDTO {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    quantity: number
}