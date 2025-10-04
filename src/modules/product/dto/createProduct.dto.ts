// src/modules/product/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductDTO {
  @ApiProperty({
    name: 'name',
    description: 'Name of the product',
    example: 'quan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'price',
    description: 'Price of the product',
    example: 100000,
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1) // Đảm bảo price >= 1
  price: number;

  @ApiProperty({
    name: 'stock',
    description: 'Stock of the product',
    example: 5,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1) // Đảm bảo stock >= 1
  stock: number;

  @ApiProperty({
    name: 'categoryId',
    description: 'Category ID of the product',
    example: 2,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(0) // Đảm bảo categoryId >= 0
  categoryId: number;

  @ApiProperty({
    name: 'images',
    description: 'Array of product images (upload via form-data)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  images?: any; // Placeholder cho Swagger, không dùng trong logic
}
