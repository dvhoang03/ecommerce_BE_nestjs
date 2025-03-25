import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CategoryDTO{
    @ApiProperty({description: 'name of category', example:"ao"})
    @IsString()
    @IsNotEmpty()
    name: string 
}
