import { IsHasOrdersOrCart } from 'src/validationAndPipes/validation/isDeleteUser';

export class DeleteUserDTO {
  @IsHasOrdersOrCart()
  id: number;
}
