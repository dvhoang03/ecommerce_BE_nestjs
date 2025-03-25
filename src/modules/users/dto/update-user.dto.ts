import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, isString, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Role {
    ADMIN = 'admin',
    USER = 'customer',
  }
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({name: 'username',description:"name of user want to update", example:"hoang"})
    @IsString()
    username?:  string

    @ApiProperty({required:false, name: 'password',description:"password of user want to update", example:"@123"})
    @IsString()
    password?: string
    
    @ApiProperty({required:false, name: 'relo',description:"role of user want to update", example:"admin"})
    @IsString()
    @IsEnum(Role,{message: ' role must be admin or customer'})
    role?: string
}
