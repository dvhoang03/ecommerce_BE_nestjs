import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entites/voucher.entites';
import { Repository } from 'typeorm';
import { VoucherDTO } from './dto/voucher.dto';
import { Order } from '../order/entities/order.entiy';
import { OrderItemService } from '../order-item/order-item.service';
import * as moment from 'moment';
import { BaseService } from '../base/base.service';

@Injectable()
export class VoucherService extends BaseService<Voucher> {
  constructor(
    @InjectRepository(Voucher) private voucherRepository: Repository<Voucher>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {
    super(voucherRepository);
  }

  async findOne(id: number): Promise<Voucher> {
    const entity = await this.voucherRepository.findOneBy({ id }); // Sử dụng 'as any' tạm thời để tránh lỗi kiểu
    if (!entity) {
      throw new NotFoundException(`Không tìm thấy  voucher với ID ${id}`);
    }
    return entity;
  }

  //tim voucher bang code
  async findVoucherByCode(code: string): Promise<Voucher> {
    console.log(code);
    const voucher = await this.voucherRepository.findOne({
      where: {
        code: code,
      },
    });
    if (!voucher) {
      throw new NotFoundException(`not found cvouh=cher vs code: ${code}`);
    }
    return voucher;
  }

  // check vocher xem có càn hạn không và số lượng còn không
  async checkVoucher(code: string): Promise<boolean> {
    const voucher = await this.voucherRepository.findOne({ where: { code } });
    if (!voucher) {
      return false;
    }
    const currentDate = moment();
    const expiryDate = moment(voucher.expiryDate);
    if (voucher.stock < 1 || currentDate.isAfter(expiryDate)) {
      return false;
    }
    return true;
  }

  // check xem code của voucher có bị trùng không
  async IsCodeUnique(code: string): Promise<boolean> {
    const voucher = await this.voucherRepository.findOne({
      where: {
        code,
      },
    });
    return voucher ? true : false;
  }

  //check  xem voucher có order khong
  async hasOrders(voucherId: number): Promise<boolean> {
    const voucher = await this.findOne(voucherId);
    const orders = await this.orderRepository.findOne({
      where: { voucher: voucher },
    });
    return orders ? true : false;
  }

  //giam so lượng voucher khi ap mã coupon
  async subtractVoucher(id: number, quantity: number): Promise<void> {
    const voucher = await this.voucherRepository.findOne({ where: { id } });
    if (!voucher) throw new NotFoundException('khong tim thay voucher');
    await this.voucherRepository.update(id, {
      stock: voucher?.stock - quantity,
    });
  }
}
