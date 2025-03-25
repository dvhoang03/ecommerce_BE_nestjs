import { ApiProperty } from "@nestjs/swagger"
import { IsDate, isDate, IsIn, isInt, IsInt, IsNotEmpty, IsString, Length, Min } from "class-validator"

export class VoucherDTO{

    @ApiProperty({name: 'code',description: 'code of voucher'  ,example:'1234@31'})
    @IsString()
    @IsNotEmpty()
    @Length( 5, 10,{message:'lenght of code is more 5 and less 10'})
    code: string

    @ApiProperty({name:'discount', description: 'phan tram giam gia', example:"10000 or 10%"})
    @IsString()
    @IsNotEmpty()
    discount: string

    @ApiProperty({name:'expiryDate', description: 'ngay het han', example: 'h'})
    @IsDate()
    @IsNotEmpty()
    expiryDate: Date

    @ApiProperty({name:'stock', })
    @IsInt()
    @IsNotEmpty()
    @Min(1, {message: 'stock of voucher is more 0'})
    stock: number
}
