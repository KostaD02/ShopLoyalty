import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;
    if (err || !user) {
      if (!email && !password) {
        throw new HttpException('Should be provide: Email and Password', 400);
      } else if (!email) {
        throw new HttpException('Email should be provided', 400);
      } else if (!password) {
        throw new HttpException('Password should be provided', 400);
      } else {
        throw new HttpException('Invalid data', 400);
      }
    }
    return user;
  }
}
