export type UserType = 'standart' | 'admin';

export interface UserInterface {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserType;
  productConnectID: string;
}

export type UnwantedKeys = 'password';

export type UserPayload = Omit<UserInterface, UnwantedKeys>;
