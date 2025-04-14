import { IsHasProduct } from "src/validationAndPipes/validation/isDeleteCategory";

export class DeleteCategoryDTO {
     @IsHasProduct()
     id: number
}