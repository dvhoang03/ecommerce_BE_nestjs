import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsVoucherCode', async: false })
export class IsVoucherCodeConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean {
        const pattern = /^voucher-\d{4}$/;
        return typeof value === 'string' && pattern.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `Voucher code ($value) must start with "voucher-" followed by 4 digits (e.g., voucher-1234)`;
    }
}

export function IsVoucherCode(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsVoucherCodeConstraint,
        });
    };
}
