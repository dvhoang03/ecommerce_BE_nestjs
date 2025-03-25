import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class IsProductCode implements ValidatorConstraintInterface{
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const pattern =/^PROD-\d{4}$/;
        return typeof value ==='string'  && pattern.test(value);
    }
    defaultMessage(args: ValidationArguments) {
        // Thông báo lỗi mặc định nếu validation thất bại
        return 'Product code ($value) must start with "PROD-" followed by 4 digits (e.g., PROD-1234)';
    }
}
