import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO{

    @ApiProperty({description:" email of user", example:"h@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({description: "password of user", example:"21231@f"})
    @IsString()
    @IsNotEmpty()
    password: string 
}