import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { VoucherService } from 'src/modules/voucher/voucher.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidVoucherCodeValidator
  implements ValidatorConstraintInterface
{
  constructor(private voucherService: VoucherService) {}

  async validate(
    code: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const results = await this.voucherService.checkVoucher(code);
    return results;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `voucher sai hoac da het han, Vui ling nhap code khac`;
  }
}

export function IsValidVoucherCode(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidVoucherCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidVoucherCodeValidator,
    });
  };
}
