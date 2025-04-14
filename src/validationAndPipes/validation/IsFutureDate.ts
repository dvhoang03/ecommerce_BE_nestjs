import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as moment from 'moment'

@ValidatorConstraint({ async: false })
@Injectable()
export class IsFutureDateValidator implements ValidatorConstraintInterface {
    validate(date: string, validationArguments?: ValidationArguments): boolean {
        const parseDate = moment(date);
        const currentDate = moment();
        return parseDate.isValid() && parseDate.isAfter(currentDate);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'thoi gian phai la tuong lai'
    }

}

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsFutureDateValidator
        })
    }
}