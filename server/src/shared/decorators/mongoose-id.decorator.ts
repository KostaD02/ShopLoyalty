import { HttpException } from '@nestjs/common';
import { registerDecorator } from 'class-validator';
import mongoose from 'mongoose';

export function MongooseId() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'mongooseId',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: string) {
          if (mongoose.isValidObjectId(value)) {
            return true;
          } else {
            throw new HttpException('Invalid mongoose Id', 400);
          }
        },
      },
    });
  };
}
