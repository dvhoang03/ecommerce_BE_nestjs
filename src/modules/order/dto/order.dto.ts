import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, Min } from "class-validator";

export class OrderDTO {
    @ApiProperty({ name: 'voucherId', description: 'voucher id', example: 1 })
    @IsInt()
    @Min(0)
    voucherId: number

    @ApiProperty({ name: 'orderItems', description: 'list cartItemId user pick', example: [1, 2, 3] })
    @IsArray()
    cartItemIds: number[]
}