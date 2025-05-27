import { Module } from '@nestjs/common';
import { KafkaLoggerService } from './kafka.service';
import { KafkaLogger } from './KafkaLogger.service';

@Module({
  providers: [KafkaLoggerService, KafkaLogger],
  exports: [KafkaLogger],
})
export class KafkaLoggerModule {}
