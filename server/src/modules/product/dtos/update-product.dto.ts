import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { MongooseId } from 'src/shared';

export class UpdateProductDto {
  @IsString()
  @MongooseId()
  _id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  imageSrc: string;
}
