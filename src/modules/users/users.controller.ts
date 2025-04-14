import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, ValidationPipe, UsePipes } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { DeleteUserDTO } from './dto/deleteUserDto.dto';
import { BaseController } from '../base/base.controller';
import { Public } from 'public/jwt-public';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    // super(usersService);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'tao 1 user moi, lỗi nếu email đã tồn tại' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all user' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: String, description: 'User Id', example: 1 })
  @ApiOperation({ summary: 'find user by id' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);
    return user;
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: ' sua user' })
  @ApiParam({ name: 'id', type: String, description: 'User Id', example: 1 })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: ' xoa khi user khong co order hoac cart' })
  @ApiParam({ name: 'id', type: Number, description: 'User Id', example: 1 })
  @Delete(':id')
  delete(@Param() request: DeleteUserDTO): Promise<boolean> {
    const { id } = request;
    return this.usersService.delete(id);
  }

}

