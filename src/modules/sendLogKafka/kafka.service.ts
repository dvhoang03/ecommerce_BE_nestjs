// kafka-logger.service.ts
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaLoggerService implements OnModuleInit, OnApplicationShutdown {
  private kafka: Kafka;
  private producer: Producer;

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'nestjs-app-logger',
      brokers: ['localhost:9092'], // Thay bằng địa chỉ Kafka broker của bạn
    });
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async sendLog(topic: string, message: string) {
    if (!this.producer) {
      console.error('Kafka producer is not initialized');
      return;
    }
    try {
      await this.producer.send({ topic, messages: [{ value: message }] });
    } catch (error) {
      console.error('Failed to send log to Kafka', error);
    }
  }
}
