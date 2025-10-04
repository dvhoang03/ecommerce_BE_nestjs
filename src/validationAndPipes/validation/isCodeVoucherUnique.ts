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
export class IsCodeVoucherUniqueValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly voucherService: VoucherService) {}

  async validate(
    code: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const results = await this.voucherService.IsCodeUnique(code);
    return !results;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'code cua voucher bi trung';
  }
}

export function IsCodeVoucherUnique(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsCodeVoucherUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCodeVoucherUniqueValidator,
    });
  };
}
