import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CustomerName implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if( typeof value !== 'string') throw new BadRequestException("value must be string");
        let str = value.toLowerCase().split(" ");
        return str.map( (s) =>{
            return s.charAt(0).toUpperCase() + s.substring(1, s.length-1);
        }).concat(" ");
    }
}