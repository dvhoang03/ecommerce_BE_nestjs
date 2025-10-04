import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseEntity, DeepPartial, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  protected constructor(protected readonly repository: Repository<T>) {}

  // tim tat ca ban ghi
  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  // tim ban ghi theo id
  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as any,
    }); // Sử dụng 'as any' tạm thời để tránh lỗi kiểu
    if (!entity) {
      throw new NotFoundException(`Không tìm thấy thực thể với ID ${id}`);
    }
    return entity;
  }

  //tao ban ghi
  async create(dto: DeepPartial<T>, ...optionalParams: any[]): Promise<T> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  //cap nhat ban ghi
  async update(
    id: number,
    dto: DeepPartial<T>,
    ...optionalParams: any[]
  ): Promise<T> {
    const entity = await this.findOne(id);
    this.repository.merge(entity, dto);
    return this.repository.save(entity);
  }

  //xoa ban ghi
  async delete(id: number): Promise<boolean> {
    const entity = await this.findOne(id);
    const results = await this.repository.delete(id);
    return results.affected === 1 ? true : false;
  }
}
