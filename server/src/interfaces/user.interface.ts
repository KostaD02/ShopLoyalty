import { UserRole } from 'src/enums';

export interface UserInterface {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  productConnectID: string;
}

export type UnwantedKeys = 'password';

export type UserPayload = Omit<UserInterface, UnwantedKeys>;
