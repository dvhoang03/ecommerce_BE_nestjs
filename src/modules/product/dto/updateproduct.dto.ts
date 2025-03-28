// src/modules/product/dto/update-product.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDTO {
    @ApiProperty({
        name: 'name',
        description: 'Name of the product',
        example: 'quan',
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @ApiProperty({
        name: 'price',
        description: 'Price of the product',
        example: 100000,
        required: false,
    })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @IsOptional()
    price?: number;

    @ApiProperty({
        name: 'stock',
        description: 'Stock of the product',
        example: 5,
        required: false,
    })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @IsOptional()
    stock?: number;

    @ApiProperty({
        name: 'categoryId',
        description: 'Category ID of the product',
        example: 2,
        required: false,
    })
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @IsOptional()
    categoryId?: number;

    @ApiProperty({
        name: 'images',
        description: 'Array of product images to update (upload via form-data)',
        type: 'array',
        items: { type: 'string', format: 'binary' },
        required: false,
    })
    images?: any; // Placeholder cho Swagger
}