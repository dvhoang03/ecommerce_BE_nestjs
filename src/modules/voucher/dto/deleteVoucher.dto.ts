import { IsVoucherHasOrder } from 'src/validationAndPipes/validation/isDeleteVoucher';
import { IsVoucherCode } from 'src/validationAndPipes/validation/isProductCode';

export class DeleteVoucherDTO {
  @IsVoucherHasOrder()
  id: number;
}
