import { BaseProduct } from './product';

export type UserType = 'standart' | 'admin';

export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  type: UserType;
  purchasedProducts: UserPurchasedProduct[];
}

export interface UserPurchasedProduct extends BaseProduct {
  count: number;
}
