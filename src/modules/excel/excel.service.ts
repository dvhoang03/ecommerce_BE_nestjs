import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { buffer } from 'stream/consumers';
import * as fs from 'fs/promises';
import { KafkaLogger } from '../sendLogKafka/KafkaLogger.service';
import { KafkaLoggerService } from '../sendLogKafka/kafka.service';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly kafkaLogger: KafkaLoggerService,
  ) {}

  async generateExcelFromProduct(response: Response): Promise<any> {
    this.kafkaLogger.sendLog(
      'log-nestjs',
      'Người dùng truy cập endpoint export',
    );

    console.log('export file');
    const products = await this.productRepository.find({
      relations: ['category'],
    });
    const data: any[] = [];
    products.forEach((product) => {
      data.push({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category ? product.category.name : '',
        images: product.images ? product.images.join(', ') : '',
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'product');
    // Gửi file về client
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename=product.xlsx',
    );

    const buffer = await XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });
    response.send(buffer);
  }

  //import file
  async importExcel(filePath: Express.Multer.File) {
    const workbook = XLSX.read(filePath.buffer, { type: 'buffer' });
    const sheetname = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetname];
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(data);
  }
}
