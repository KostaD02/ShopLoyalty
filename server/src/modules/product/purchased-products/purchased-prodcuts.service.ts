import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import {
  PurchasedProduct,
  PurchasedProductDocument,
} from 'src/schemas/product';
import { MongooseValidatorService } from 'src/shared';
import { Model } from 'mongoose';

@Injectable()
export class PurchasedProductsService {
  constructor(
    @InjectModel(PurchasedProduct.name)
    private purchasedProdutModel: Model<PurchasedProductDocument>,
    private mongooseValidator: MongooseValidatorService,
  ) {}

  async createConnection(userId: string) {
    this.mongooseValidator.isValidObjectId(userId);

    const connectionExists = await this.purchasedProdutModel.findOne({
      userId,
    });

    if (connectionExists) {
      throw new HttpException('Connection with this user already exists', 409);
    }

    const connection = await this.purchasedProdutModel.create({
      userId,
      products: [],
    });

    return connection;
  }
}
