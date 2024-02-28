import { UserRole } from '@app-shared/enums';

export interface BaseUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User extends Omit<BaseUser, 'password'> {
  _id: string;
  role: UserRole;
  productConnectID: string;
  cartID: string;
}
