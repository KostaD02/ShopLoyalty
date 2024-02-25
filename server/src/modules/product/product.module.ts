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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: PurchasedProduct.name, schema: PurchasedProductSchema },
    ]),
  ],
  providers: [
    MongooseValidatorService,
    PurchasedProductsService,
    ProductService,
  ],
  controllers: [PurchasedProductsController, ProductController],
})
export class UserModule {}
