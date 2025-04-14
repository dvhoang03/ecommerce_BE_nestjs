import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import * as moment from 'moment'

@Injectable()
export class DateFormatPipe implements PipeTransform {
    transform(value: any, metadata?: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException("date is required");
        }

        //kiem tra xem gia tri co phai la ngay hop le khong
        const parseDate = moment(value);

        //chuyen doi moment thanh doi tuong Date
        return parseDate.toDate()
    }
}