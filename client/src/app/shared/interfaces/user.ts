import { UserRole } from '@app-shared/enums';

export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  productConnectID: string;
  cartID: string;
}
