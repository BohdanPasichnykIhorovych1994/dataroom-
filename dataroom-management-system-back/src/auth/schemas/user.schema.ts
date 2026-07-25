import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USERS_COLLECTION } from '../constants';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({
  collection: USERS_COLLECTION,
  versionKey: false,
})
export class UserEntity {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true })
  createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
