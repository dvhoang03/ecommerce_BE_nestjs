import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateProductDTO{

    @ApiProperty({name: 'name', description:'name of product', example: 'quan'})
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({name: 'price', description:'price of product', example: 100000})
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    price: number
    
    @ApiProperty({name: 'stock', description:'stock of product', example: 5})
    @IsInt()
    @Min(1)
    stock: number

    @ApiProperty({name: 'categoryId', description:'categoryId of product', example: 2})
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    categoryId: number

    
}