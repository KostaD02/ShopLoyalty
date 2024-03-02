import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product';
import { MongooseValidatorService } from 'src/shared';
import {
  ProductDto,
  UpdateProductDiscountsDto,
  UpdateProductDto,
} from '../dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private produtModel: Model<ProductDocument>,
    private mongooseValidator: MongooseValidatorService,
  ) {}

  async getAllProduct() {
    return this.produtModel.find({});
  }

  async getProductById(id: string) {
    this.mongooseValidator.isValidObjectId(id);
    const product = await this.produtModel.findOne({
      _id: id,
    });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  async createProduct(productDto: ProductDto) {
    const productExists = await this.produtModel.findOne({
      name: productDto.name,
    });

    if (productExists) {
      throw new HttpException('Duplicated product', 400);
    }

    const product = await this.produtModel.create({
      ...productDto,
      productDiscount: productDto.productDiscount || [],
    });

    return product;
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    const { name, price, description, imageSrc } = updateProductDto;

    if (!name && !price && !description && !imageSrc) {
      throw new HttpException('Nothing to update', 400);
    }

    const product = await this.produtModel.findOneAndUpdate(
      { _id: updateProductDto._id },
      {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        imageSrc: updateProductDto.imageSrc,
      },
    );

    const updatedUser = await this.produtModel.findOne({
      _id: product.id,
    });

    return updatedUser;
  }

  async updateProductDiscounts(updateProducts: UpdateProductDiscountsDto) {
    if (updateProducts.productDiscount.length <= 0) {
      throw new HttpException('Nothing to add', 400);
    }

    const product = await this.produtModel.findOne({ _id: updateProducts._id });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    updateProducts.productDiscount.forEach((product) => {
      if (product.range.length >= 3 || product.range.length <= 1) {
        throw new HttpException(
          'Range should be exact 2 element [number, number]',
          400,
        );
      }

      product.range.forEach((range) => {
        if (range < 0) {
          throw new HttpException("Range can't be negative number", 400);
        }
      });
    });

    const products = updateProducts.productDiscount.sort(
      (a, b) => a.range[0] - b.range[0],
    );

    for (let i = 1; i < products.length; i++) {
      const prevItem = products[i - 1];
      const currentItem = products[i];

      if (prevItem.range[1] >= currentItem.range[0]) {
        throw new HttpException('Overlap detected in count ranges', 400);
      }

      if (prevItem.discountPercentage > currentItem.discountPercentage) {
        throw new HttpException(
          'Discount percentage is greater in lower range',
          400,
        );
      }
    }

    product.productDiscount = products;

    await product.save();

    return product;
  }

  async deleteProductById(id: string) {
    this.mongooseValidator.isValidObjectId(id);

    const user = await this.produtModel.findOneAndDelete({
      _id: id,
    });

    if (!user) {
      throw new HttpException('Product not found', 404);
    }

    return {
      acknowledged: true,
    };
  }
}
