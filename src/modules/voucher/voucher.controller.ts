import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Voucher } from './entites/voucher.entites';
import { VoucherDTO } from './dto/voucher.dto';

@ApiTags('Voucher')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) { };

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all vouchers' })
  @Get()
  getAll(): Promise<Voucher[]> {
    return this.voucherService.getAll();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create voucher' })
  @Post()
  createVoucher(@Body() voucher: VoucherDTO) {
    return this.voucherService.createVoucher(voucher);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get detal  voucher' })
  @ApiParam({ name: 'id', description: 'id of voucher', example: 1 })
  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.getDetail(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'check voucher' })
  @ApiParam({ name: 'code', description: 'code of voucher', example: 'voucher001' })
  @Get('check/:code')
  checkCodeVoucher(@Param('code') code: string): Promise<Voucher> {
    return this.voucherService.checkVoucher(code);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete voucher' })
  @ApiParam({ name: 'id', description: 'id of voucher', example: 1 })
  @Delete(':id')
  deleteVoucher(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.deleteVoucher(id);
  }

}
