// kafka-logger.ts
import { LoggerService, Injectable } from '@nestjs/common';
import { KafkaLoggerService } from './kafka.service';

@Injectable()
export class KafkaLogger implements LoggerService {
  constructor(private readonly kafkaLoggerService: KafkaLoggerService) {}

  log(message: string) {
    // console.log(message);
    this.kafkaLoggerService.sendLog('log-nestjs', message);
  }

  error(message: string, trace: string) {
    // console.error(message, trace);
    this.kafkaLoggerService.sendLog(
      'log-nestjs',
      `[ERROR] ${message} - ${trace}`,
    );
  }

  warn(message: string) {
    // console.warn(message);
    this.kafkaLoggerService.sendLog('log-nestjs', `[WARN] ${message}`);
  }

  debug(message: string) {
    // console.debug(message);
    this.kafkaLoggerService.sendLog('log-nestjs', `[DEBUG] ${message}`);
  }

  verbose(message: string) {
    // console.log(message);
    this.kafkaLoggerService.sendLog('log-nestjs', `[VERBOSE] ${message}`);
  }
}
