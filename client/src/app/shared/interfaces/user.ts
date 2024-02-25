import { BaseProduct } from './product';

export type UserType = 'standart' | 'admin';

export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  type: UserType;
  productConnectID: string;
}

export interface UserPurchasedProduct extends Omit<BaseProduct, 'price'> {
  count: number;
}
