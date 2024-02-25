export type UserType = 'standart' | 'admin';

export interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  type: UserType;
  productConnectID: string;
}

export type UnwantedKeys = 'password';

export type UserPayload = Omit<User, UnwantedKeys>;
