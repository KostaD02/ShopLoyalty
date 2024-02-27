import { IsNumber, IsString, Min } from 'class-validator';
import { MongooseId } from 'src/shared';

export class CartDto {
  @IsString()
  @MongooseId()
  _id: string;

  @IsNumber()
  @Min(1)
  count: number;
}
