import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from 'src/schemas/cart';
import { MongooseValidatorService } from 'src/shared';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    private mongooseValidator: MongooseValidatorService,
  ) {}

  async createCart(userId: string) {
    this.mongooseValidator.isValidObjectId(userId);

    const cartExists = await this.cartModel.findOne({ userId });

    if (cartExists) {
      throw new HttpException('User already have cart', 400);
    }

    const cart = await this.cartModel.create({
      userId,
      total: 0,
      products: [],
    });

    return cart;
  }
}
