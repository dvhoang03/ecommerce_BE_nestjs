import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { KafkaLoggerService } from '../sendLogKafka/kafka.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ExcelService, KafkaLoggerService],
  exports: [ExcelService],
  controllers: [ExcelController],
})
export class ExcelModule {}
