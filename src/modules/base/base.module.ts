import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';

@Module({
    imports: [TypeOrmModule],

})
export class BaseModule { }
