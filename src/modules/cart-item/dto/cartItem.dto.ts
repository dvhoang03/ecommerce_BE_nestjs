import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";
import { IsValidQuantity } from "src/validationAndPipes/validation/isValidQuantity";

export class CreateCartItemDTO {

    @ApiProperty({ name: 'quantity', description: 'quantity of product', example: 2 })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    @IsValidQuantity()
    quantity: number

    @ApiProperty({ name: 'productId', description: 'id of product', example: 2 })
    @IsInt()
    @Min(0)
    @IsNotEmpty()
    productId: number
}



export class UpdateCartItemDTO {

    @ApiProperty({ name: 'quantity', description: 'quantity of product', example: 4 })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    @IsValidQuantity()
    quantity: number

    productId?: number;

}