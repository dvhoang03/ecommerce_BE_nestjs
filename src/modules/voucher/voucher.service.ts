import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entites/voucher.entites';
import { Repository } from 'typeorm';
import { VoucherDTO } from './dto/voucher.dto';

@Injectable()
export class VoucherService {
    constructor(
        @InjectRepository(Voucher) private voucherRepository: Repository<Voucher>
    ){};

    async getAll(): Promise<Voucher[]>{
        return this.voucherRepository.find();
    }

    async getDetail(id: number): Promise<Voucher | null>{
        const voucher = await this.voucherRepository.findOne({where:{id}});
        if( !voucher){
            throw new NotFoundException(" not found voucher by id");
        }
        return  voucher;
    }

    async createVoucher(vou : VoucherDTO): Promise<Voucher>{
        const voucher = this.voucherRepository.create(vou);
        return this.voucherRepository.save(voucher);
    }

    

    async deleteVoucher(id: number){
        return this.voucherRepository.delete(id);
    }

}
