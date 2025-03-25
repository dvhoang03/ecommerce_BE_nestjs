import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";

enum Role {
    ADMIN = 'admin',
    USER = 'customer',
}
export class CreateUserDto {

    @ApiProperty({ description: 'Username of the user', example: 'testuser' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'Email of the user', example: 'test@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password of the user', example: '123456' })
    @IsString()
    password: string;

    @ApiProperty({ description: 'role  of the user', example: 'admin' })
    @IsEnum(Role)
    @IsString()
    role: string;
}
