import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategotyService } from 'src/modules/categoty/categoty.service';

@ValidatorConstraint({ async: true, name: 'hasProducts' })
@Injectable()
export class IsHasProductsValidator implements ValidatorConstraintInterface {
  constructor(private readonly categoryService: CategotyService) {}
  async validate(
    categoryId: number,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const product = await this.categoryService.hasProducts(categoryId);
    return product ? false : true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'khong the xoa category vi co product lien quan';
  }
}

export function IsHasProduct(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsHasProduct',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsHasProductsValidator,
    });
  };
}
