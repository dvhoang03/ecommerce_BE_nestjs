import { IsString } from "class-validator";

export class PayLoadDTO {
    @IsString()
    email: string

    @IsString()
    role: string

    @IsString()
    sub: string
}