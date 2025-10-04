import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BaseEntity, DeepPartial, ObjectLiteral } from 'typeorm';
import { BaseService } from './base.service';

@Controller()
export abstract class BaseController<T extends ObjectLiteral> {
  protected constructor(protected readonly service: BaseService<T>) {}

  @Get()
  async findAll(): Promise<T[]> {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOne(+id);
  }

  @Post()
  async create(@Body() dto: DeepPartial<T>): Promise<T> {
    return this.service.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: DeepPartial<T>,
  ): Promise<T> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param() request: any): Promise<boolean> {
    return this.service.delete(+request);
  }
}
