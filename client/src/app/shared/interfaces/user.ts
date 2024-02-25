import { UserRole } from '@app-shared/enums';
import { BaseProduct } from './product';

export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  productConnectID: string;
}

export interface UserPurchasedProduct extends Omit<BaseProduct, 'price'> {
  count: number;
}
