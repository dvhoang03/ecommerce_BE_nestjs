import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entites/voucher.entites';
import { Order } from '../order/entities/order.entiy';
import { OrderItemModule } from '../order-item/order-item.module';
import { IsCodeVoucherUniqueValidator } from 'src/validationAndPipes/validation/isCodeVoucherUnique';
import { IsVoucherHasOrderValidator } from 'src/validationAndPipes/validation/isDeleteVoucher';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, Order])],
  controllers: [VoucherController],
  providers: [
    VoucherService,
    IsCodeVoucherUniqueValidator,
    IsVoucherHasOrderValidator,
  ],
  exports: [VoucherService],
})
export class VoucherModule {}
