import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entites/voucher.entites';
import { Repository } from 'typeorm';
import { VoucherDTO } from './dto/voucher.dto';
import { Order } from '../order/entities/order.entiy';
import { OrderItemService } from '../order-item/order-item.service';

@Injectable()
export class VoucherService {
    constructor(
        @InjectRepository(Voucher) private voucherRepository: Repository<Voucher>,
        @InjectRepository(Order) private orderRepository: Repository<Order>,
    ) { };

    async getAll(): Promise<Voucher[]> {
        return this.voucherRepository.find();
    }

    async getDetail(id: number): Promise<Voucher> {
        const voucher = await this.voucherRepository.findOne({ where: { id } });
        if (!voucher) {
            throw new NotFoundException(" not found voucher by id");
        }
        return voucher;
    }

    async createVoucher(vou: VoucherDTO): Promise<Voucher> {
        const voucher = this.voucherRepository.create(vou);
        return this.voucherRepository.save(voucher);
    }

    async checkVoucher(code: string): Promise<Voucher> {
        const voucher = await this.voucherRepository.findOne({ where: { code } });
        if (!voucher) {
            throw new NotFoundException("code of voucher invalid")
        }
        if (voucher.stock < 1 || voucher.expiryDate < new Date()) {
            throw new BadRequestException("Invalid or Expired voucher")
        }
        return voucher;
    }


    async deleteVoucher(id: number) {
        const voucher = await this.getDetail(id);
        const orders = await this.orderRepository.find({ where: { voucher: voucher } });
        if (orders) {
            throw new BadRequestException(`cannot delete voucher because it is used`)
        }
        return this.voucherRepository.delete(id);
    }

}
