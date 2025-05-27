import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

export class ExcelDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Excel file to upload',
  })
  file: any;
}

@ApiTags('excel')
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelservice: ExcelService) {}

  @ApiBearerAuth('access-token')
  @Get('export/product')
  async exportExcel(@Res() res: Response) {
    await this.excelservice.generateExcelFromProduct(res);
  }

  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ExcelDTO,
  ) {
    if (!file) {
      throw new Error('no file upload');
    }
    await this.excelservice.importExcel(file);
  }
}
