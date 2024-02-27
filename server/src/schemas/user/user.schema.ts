import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop() name: string;
  @Prop() lastName: string;
  @Prop() email: string;
  @Prop() password: string;
  @Prop() role: UserRole;
  @Prop() productConnectID: string;
  @Prop() cartID: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
