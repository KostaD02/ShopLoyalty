import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas';
import { Cart, CartSchema } from 'src/schemas/cart';
import {
  Product,
  ProductSchema,
  PurchasedProduct,
  PurchasedProductSchema,
} from 'src/schemas/product';
import { MongooseValidatorService } from 'src/shared';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: PurchasedProduct.name, schema: PurchasedProductSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN || '1'}h` },
    }),
  ],
  controllers: [CartController],
  providers: [CartService, MongooseValidatorService],
})
export class CartModule {}
