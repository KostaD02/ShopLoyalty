import { PurchasedProducts } from './product';

export interface CartProducts extends PurchasedProducts {
  discountPercentage: number;
}

export interface Cart {
  _id: string;
  userId: string;
  total: number;
  products: CartProducts[];
}

export interface CartProduct {
  _id: string;
  count: number;
}

export interface CartCheckout {
  total: number;
  completed: boolean;
  currentCart: Cart;
}
