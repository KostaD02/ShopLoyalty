import { IsString } from 'class-validator';
import { ProductDiscount } from 'src/interfaces';
import { MongooseId } from 'src/shared';

export class UpdateProductDiscountsDto {
  @IsString()
  @MongooseId()
  _id: string;

  productDiscount: ProductDiscount[];
}
