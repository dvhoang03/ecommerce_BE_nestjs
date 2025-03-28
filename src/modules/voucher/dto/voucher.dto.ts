import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDate, isDate, IsIn, isInt, IsInt, IsNotEmpty, IsString, Length, Min } from "class-validator"
import { IsVoucherCode } from "src/validationAndPipes/validation/isProductCode"

export class VoucherDTO {

    @ApiProperty({ name: 'code', description: 'code of voucher', example: 'voucher-0001' })
    @IsString()
    @IsNotEmpty()
    @IsVoucherCode()
    code: string

    @ApiProperty({ name: 'discount', description: 'phan tram giam gia', example: "10000 or 10%" })
    @IsString()
    @IsNotEmpty()
    discount: string

    @ApiProperty({ name: 'expiryDate', description: 'ngay het han', example: '2025-04-15' })
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    expiryDate: Date

    @ApiProperty({ name: 'stock', })
    @IsInt()
    @IsNotEmpty()
    @Min(1, { message: 'stock of voucher is more 0' })
    stock: number
}
