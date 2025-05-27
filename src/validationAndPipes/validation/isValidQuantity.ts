import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { forEach } from 'lodash';
import { CartItemService } from 'src/modules/cart-item/cart-item.service';
import { CreateCartItemDTO } from 'src/modules/cart-item/dto/cartItem.dto';
import { ProductService } from 'src/modules/product/product.service';

class ArgumentIsValidQuantity {
  productId: number;
  quantity: number;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidQuantityValidator implements ValidatorConstraintInterface {
  constructor(
    private productService: ProductService,
    private cartItemService: CartItemService,
  ) {}

  async validate(
    value: number | number[],
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    if (typeof value === 'number') {
      let { productId, quantity } =
        validationArguments.object as CreateCartItemDTO;
      const cartItem =
        await this.cartItemService.findCartItemByProduct(productId);
      if (cartItem) {
        quantity = quantity + cartItem.quantity;
      }
      const results = await this.productService.IsValidProductQuantity(
        productId,
        quantity,
      );
      return results;
    } else {
      const cartItemIds = value;
      if (cartItemIds.length === 0) {
        return false;
      }

      for (const [index, cartItemId] of cartItemIds.entries()) {
        const cartItem = await this.cartItemService.findOne(cartItemId);
        const stockProduct = cartItem.product.stock;
        if (stockProduct < cartItem.quantity) {
          return false;
        }
      }
      return true;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const object = validationArguments.object as CreateCartItemDTO;
    return `so luong productid ${object.productId} khong du`;
  }
}

export function IsValidQuantity(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidQuantity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidQuantityValidator,
    });
  };
}
