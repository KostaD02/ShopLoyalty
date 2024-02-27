import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PurchasedProducts } from 'src/interfaces';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ versionKey: false })
export class Cart {
  @Prop() userId: string;
  @Prop() total: number;
  @Prop({
    type: [
      {
        name: { type: String },
        price: { type: Number },
        count: { type: Number },
        _id: { type: String },
      },
    ],
    select: true,
  })
  products: PurchasedProducts[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
