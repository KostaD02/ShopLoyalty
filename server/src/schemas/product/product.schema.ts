import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProductDiscount } from 'src/interfaces';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product {
  @Prop() name: string;
  @Prop() price: number;
  @Prop() description: string;
  @Prop() imageSrc: string;
  @Prop({
    type: [
      {
        range: { type: [Number] },
        discountPercentage: { type: Number },
        _id: false,
      },
    ],
    select: false,
  })
  productDiscount: ProductDiscount[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
