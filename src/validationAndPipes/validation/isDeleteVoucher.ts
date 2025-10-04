import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { result } from 'lodash';
import { VoucherService } from 'src/modules/voucher/voucher.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsVoucherHasOrderValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly voucherService: VoucherService) {}

  async validate(
    voucherId: number,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const results = await this.voucherService.hasOrders(voucherId);
    return results ? false : true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'khong the xoa voucher do co order lien quan';
  }
}

export function IsVoucherHasOrder(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsVoucherHasOrder',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsVoucherHasOrderValidator,
    });
  };
}
