import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UsersService } from "src/modules/users/users.service";

@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueValidator implements ValidatorConstraintInterface {
    constructor(private userService: UsersService) { };

    async validate(email: string, validationArguments?: ValidationArguments): Promise<boolean> {
        return !(await this.userService.findUserByEmail(email));
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Email da ton tai. Nhap email khac';
    }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsEmailUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsEmailUniqueValidator,
        });

    };
}