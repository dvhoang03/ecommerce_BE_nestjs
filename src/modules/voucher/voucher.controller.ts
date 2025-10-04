import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Voucher } from './entites/voucher.entites';
import { VoucherDTO } from './dto/voucher.dto';
import { DeleteVoucherDTO } from './dto/deleteVoucher.dto';

@ApiTags('Voucher')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'create voucher, nếu trùng code hoặc không đúng đinh dang voucher0000 thì sẽ lỗi',
  })
  @Post()
  createVoucher(@Body() voucher: VoucherDTO) {
    return this.voucherService.create(voucher);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all vouchers' })
  @Get()
  getAll(): Promise<Voucher[]> {
    return this.voucherService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get detal  voucher' })
  @ApiParam({ name: 'id', description: 'id of voucher', example: 1 })
  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete voucher khi chưa ap mã lần nào' })
  @ApiParam({ name: 'id', description: 'id of voucher', example: 1 })
  @Delete(':id')
  deleteVoucher(@Param() request: DeleteVoucherDTO) {
    return this.voucherService.delete(request.id);
  }
}
