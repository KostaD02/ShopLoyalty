import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserType } from 'src/interfaces';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop() name: string;
  @Prop() lastName: string;
  @Prop() email: string;
  @Prop() password: string;
  @Prop() role: UserType;
  @Prop() productConnectID: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
