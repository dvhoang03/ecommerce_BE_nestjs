import { IsInt, Min } from 'class-validator';

export class CartDTO {
  @IsInt()
  @Min(0, { message: 'value more 0' })
  userId: number;
}
