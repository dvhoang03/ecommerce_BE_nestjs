import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { IsDeletableOrder } from "src/validationAndPipes/validation/isDeleteOrder";
import { IsValidQuantity } from "src/validationAndPipes/validation/isValidQuantity";
import { IsValidVoucherCode } from "src/validationAndPipes/validation/isValidVoucherCode";
import { Column } from "typeorm";

enum status {
    "pending",
    "shipped",
    "delivered"
}

export class OrderDTO {
    @ApiProperty({ name: 'code', description: 'voucher id', example: 'voucher-0001', required: false })
    @IsString()
    @IsNotEmpty()
    @IsValidVoucherCode()
    code?: string;

    @ApiProperty({ name: 'cartItemIds', description: 'list of cartItemId user picked', example: [1, 2, 3] })
    @IsArray()
    @IsInt({ each: true })  // Kiểm tra mỗi phần tử trong mảng là số nguyên
    @IsNotEmpty()
    @IsValidQuantity()
    cartItemIds: number[];
}
export class OrderUpdate {
    @ApiProperty({ name: 'status', description: 'status', example: "shipped" })
    @IsString()
    @IsNotEmpty()
    @IsEnum(status)
    @Column()
    status: string
}

export class DeleteOrderDTO {
    @IsDeletableOrder()
    id: number
}