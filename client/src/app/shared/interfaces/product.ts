export interface BaseProduct {
  _id: string;
  name: string;
  price: number;
  imageSrc: string;
}

export interface ProductDiscount {
  range: [number, number];
  discountPercentage: number;
}

export interface Product extends BaseProduct {
  description: string;
  productDiscount: ProductDiscount[];
}

export interface ProductWithUrl extends Product {
  productUrl: string;
}

export interface PurchasedProducts extends BaseProduct {
  count: number;
}

export interface UserPurchasedProduct {
  _id: string;
  userId: string;
  products: PurchasedProducts[];
}
