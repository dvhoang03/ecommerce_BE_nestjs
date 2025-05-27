import {
  IsHasOrderItemOrCartItem,
  IsHasOrderItemOrCartItemValidator,
} from 'src/validationAndPipes/validation/IsDeleteProduct';

export class DeleteProductDTO {
  @IsHasOrderItemOrCartItem()
  id: number;
}
