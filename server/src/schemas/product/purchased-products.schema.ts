import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PurchasedProducts } from 'src/interfaces';

export type PurchasedProductDocument = HydratedDocument<PurchasedProduct>;

@Schema({ versionKey: false })
export class PurchasedProduct {
  @Prop() userId: string;
  @Prop({
    type: [
      {
        name: { type: String },
        price: { type: Number },
        count: { type: Number },
        _id: { type: String },
      },
    ],
    select: false,
  })
  products: PurchasedProducts[];
}

export const PurchasedProductSchema =
  SchemaFactory.createForClass(PurchasedProduct);
