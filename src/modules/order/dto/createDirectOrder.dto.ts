import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { IsValidQuantity } from "src/validationAndPipes/validation/isValidQuantity";
import { IsValidVoucherCode } from "src/validationAndPipes/validation/isValidVoucherCode";

export class CreateDirectOrderDTO {
    @ApiProperty({ name: 'code', description: 'voucher id', example: 'voucher-0001', required: false })
    @IsString()
    @IsNotEmpty()
    @IsValidVoucherCode()
    code?: string;

    @ApiProperty({ name: 'productId', description: 'product id ', example: 1 })
    @IsInt()  // Kiểm tra mỗi phần tử trong mảng là số nguyên
    @IsNotEmpty()
    productId: number;

    @ApiProperty({ name: 'quantity', description: 'so luong dat', example: 5 })
    @IsInt()
    @IsValidQuantity()
    quantity: number
}