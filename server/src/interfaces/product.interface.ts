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
  imageSrc: string;
  description: string;
  productDiscount: ProductDiscount[];
}

export interface PurchasedProducts extends BaseProduct {
  count: number;
}

export interface CartProducts extends PurchasedProducts {
  discountPercentage: number;
}

export interface UserPurchasedProduct {
  _id: string;
  userId: string;
  products: PurchasedProducts[];
}
