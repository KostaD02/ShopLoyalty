import { IsArray, IsNumber, IsString, IsUrl } from 'class-validator';
import { ProductDiscount } from 'src/interfaces';

export class ProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsUrl()
  imageSrc: string;

  @IsArray()
  productDiscount: ProductDiscount[];
}
