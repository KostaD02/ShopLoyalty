import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product';
import { MongooseValidatorService } from 'src/shared';
import { ProductDto, UpdateProductDto } from '../dtos';

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
}
