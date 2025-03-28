import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";

enum Role {
    ADMIN = 'admin',
    USER = 'customer',
}
export class CreateUserDto {

    @ApiProperty({ name: 'username', description: 'Username of the user', example: 'testuser', required: true })
    @IsString()
    username: string;

    @ApiProperty({ name: 'email', description: 'Email of the user', example: 'test@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ name: 'password', description: 'Password of the user', example: '123456' })
    @IsString()
    password: string;

    @ApiProperty({ name: 'role', description: 'role  of the user', example: 'admin' })
    @IsEnum(Role)
    @IsString()
    role: string;
}
