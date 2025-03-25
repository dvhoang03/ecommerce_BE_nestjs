import { Controller, Get } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Voucher')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {};

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'get all vouchers'})
  @Get()
  getAll(){
    
  }
}
