import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/modules/users/users.service';

@ValidatorConstraint({ name: 'IsDeleteUser', async: true })
@Injectable()
export class IsDeleteUserValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(
    useId: number,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const hasOrders = await this.userService.hasOrders(useId);
    const hasCart = await this.userService.hasCart(useId);
    return hasCart || hasOrders ? false : true;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'khong the xua user  co cart hoac order.';
  }
}

export function IsHasOrdersOrCart(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsHasOrdersOrCart',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDeleteUserValidator,
    });
  };
}
