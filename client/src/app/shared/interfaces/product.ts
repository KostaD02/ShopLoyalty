export interface BaseProduct {
  _id: string;
  name: string;
  price: string;
}

export interface Product extends BaseProduct {
  imageSrc: string;
  productDiscounts: ProductDiscount[];
}

export interface ProductDiscount {
  count: number;
  discountPercentage: number;
}

export interface ProductLotyalty extends BaseProduct, ProductDiscount {}
