import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ProductService } from "src/modules/product/product.service";


@ValidatorConstraint({ async: true, name: 'IsHasOrderItemOrCartItemValidator' })
@Injectable()
export class IsHasOrderItemOrCartItemValidator implements ValidatorConstraintInterface {
    constructor(private readonly productService: ProductService) { }
    async validate(productId: number, validationArguments?: ValidationArguments): Promise<boolean> {
        const results = await this.productService.hasOrderOrCartItem(+productId);
        return (results ? false : true)
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'khong the xoa produc vi co order va cart lien quan'
    }
}

export function IsHasOrderItemOrCartItem(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsHasOrderItemOrCartItemValidator',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsHasOrderItemOrCartItemValidator
        })
    }
}