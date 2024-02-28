import { UserRole } from '@app-shared/enums';
import { JwtTimes } from './jwt';

export interface BaseUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User extends Omit<BaseUser, 'password'>, JwtTimes {
  _id: string;
  role: UserRole;
  productConnectID: string;
  cartID: string;
}
