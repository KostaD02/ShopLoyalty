import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartProducts, UserPayload } from 'src/interfaces';
import { Cart, CartDocument } from 'src/schemas/cart';
import { MongooseValidatorService } from 'src/shared';
import { CartDto } from './dtos';
import {
  Product,
  ProductDocument,
  PurchasedProduct,
  PurchasedProductDocument,
} from 'src/schemas/product';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private produtModel: Model<ProductDocument>,
    @InjectModel(PurchasedProduct.name)
    private purchasedProdutModel: Model<PurchasedProductDocument>,
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

  async getCurrentCart(userPayload: UserPayload) {
    const cart = await this.cartModel.findOne({ userId: userPayload._id });

    if (!cart) {
      throw new HttpException(
        `User with ${userPayload._id} id, doesn't have a cart`,
        404,
      );
    }

    return cart;
  }

  async addProduct(userPayload: UserPayload, productDto: CartDto) {
    const cart = await this.getCurrentCart(userPayload);
    const product = await this.produtModel.findOne({ _id: productDto._id });
    const connection = await this.purchasedProdutModel.findOne({
      userId: userPayload._id,
    });

    const cartProductIndex = cart.products.findIndex(
      (item) => item._id === product.id,
    );

    if (
      cartProductIndex !== -1 &&
      cart.products[cartProductIndex].count === productDto.count
    ) {
      throw new HttpException(
        'Product with same count is already in cart',
        400,
      );
    }

    if (
      cartProductIndex !== -1 &&
      cart.products[cartProductIndex].count !== productDto.count
    ) {
      cart.products[cartProductIndex].count = productDto.count;
    } else if (connection.products.length <= 0) {
      cart.products.push(this.getProductForCart(product, productDto.count));
    } else {
      const connectionProduct = connection.products.find(
        (item) => item._id === product.id,
      );
      const count = connectionProduct?.count || 0;
      if (count === 0) {
        cart.products.push(this.getProductForCart(product, productDto.count));
      } else {
        let discountPercentage = 0;
        for (const discount of product.productDiscount) {
          const [min, max] = discount.range;
          if (count >= min && count <= max) {
            discountPercentage = discount.discountPercentage;
            break;
          } else if (count > max && discountPercentage === 0) {
            discountPercentage = discount.discountPercentage;
          }
        }
        cart.products.push(
          this.getProductForCart(product, productDto.count, discountPercentage),
        );
      }
    }

    cart.total = Number(
      cart.products
        .reduce((acc, product) => {
          const discountedPrice =
            product.price * (1 - product.discountPercentage / 100);
          return acc + discountedPrice * product.count;
        }, 0)
        .toFixed(3),
    );

    await cart.save();

    return cart;
  }

  private getProductForCart(
    product: ProductDocument,
    count: number,
    discount = 0,
  ): CartProducts {
    const productForCart: Partial<CartProducts> = {};
    productForCart._id = product.id;
    productForCart.count = count;
    productForCart.discountPercentage = discount;
    productForCart.name = product.name;
    productForCart.price = product.price;
    productForCart.imageSrc = product.imageSrc;
    return productForCart as CartProducts;
  }

  async checkout(userPayload: UserPayload) {
    const cart = await this.getCurrentCart(userPayload);

    if (cart.products.length === 0) {
      throw new HttpException('Cart is clear', 409);
    }

    const connection = await this.purchasedProdutModel.findOne({
      userId: userPayload._id,
    });

    cart.products.forEach((product) => {
      connection.products.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        count: product.count,
        imageSrc: product.imageSrc,
      });
    });

    const total = cart.total;

    cart.products.splice(0);
    cart.total = 0;

    await connection.save();
    await cart.save();

    return {
      total,
      completed: true,
      currentCart: cart,
    };
  }

  async removeSingleItem(userPayload: UserPayload, id: string) {
    this.mongooseValidator.isValidObjectId(id);
    const cart = await this.getCurrentCart(userPayload);

    const indexOfProduct = cart.products.findIndex(
      (product) => product._id === id,
    );

    if (indexOfProduct === -1) {
      throw new HttpException("Cart doesn't have item with that id", 404);
    }

    cart.products.splice(indexOfProduct, 1);
    cart.total = Number(
      cart.products
        .reduce((acc, product) => {
          const discountedPrice =
            product.price * (1 - product.discountPercentage / 100);
          return acc + discountedPrice * product.count;
        }, 0)
        .toFixed(3),
    );
    await cart.save();

    return cart;
  }

  async clearCart(userPayload: UserPayload) {
    const cart = await this.getCurrentCart(userPayload);

    if (cart.products.length === 0) {
      throw new HttpException("Cart doesn't have any item to clear", 400);
    }

    cart.products.splice(0);
    cart.total = 0;
    await cart.save();

    return cart;
  }
}
