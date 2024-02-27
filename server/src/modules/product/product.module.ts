import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseValidatorService } from 'src/shared';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import {
  Product,
  ProductSchema,
  PurchasedProduct,
  PurchasedProductSchema,
} from 'src/schemas/product';
import {
  PurchasedProductsController,
  PurchasedProductsService,
} from './purchased-products';

import { User, UserSchema } from 'src/schemas';
import { JwtModule } from '@nestjs/jwt';
import { Cart, CartSchema } from 'src/schemas/cart';

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
  providers: [
    MongooseValidatorService,
    PurchasedProductsService,
    ProductService,
  ],
  controllers: [PurchasedProductsController, ProductController],
})
export class ProductModule {}
