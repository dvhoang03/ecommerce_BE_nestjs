import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDTO{

    @IsString()
    @IsNotEmpty()
    name: string
    @IsOptional()

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @IsOptional()
    price: number

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    @IsOptional()
    stock: number

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @IsOptional()
    categoryId: number

    
}