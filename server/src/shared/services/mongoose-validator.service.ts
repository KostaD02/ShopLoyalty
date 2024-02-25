import { HttpException, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class MongooseValidatorService {
  isValidObjectId(...ids: string[]) {
    ids.forEach((id) => {
      mongoose.isValidObjectId(id) || this.throwInvalidId();
    });
  }

  private throwInvalidId() {
    throw new HttpException('Invalid mongoose object id', 400);
  }
}
