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
        return `Mã voucher (${args.value}) phải bắt đầu bằng "voucher-" theo sau là 4 chữ số (ví dụ: voucher-1234)`;
    }
}

export function IsVoucherCode(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsVoucherCode',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsVoucherCodeConstraint,
        });
    };
}