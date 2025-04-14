import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { OrderService } from "src/modules/order/order.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDeleteOrderValidator implements ValidatorConstraintInterface {
    constructor(private readonly orderService: OrderService) { }

    async validate(orderId: number, validationArguments?: ValidationArguments): Promise<boolean> {
        const order = await this.orderService.findOrderById(orderId);
        return (order.status === 'pending' ? true : false)
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'khong the xoa order da van chuyen'
    }
}

export function IsDeletableOrder(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsDeletableOrder',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsDeleteOrderValidator
        })
    }
}