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
        if (password.length < 8) {
          throw new HttpException('Password should be more than 8 char', 400);
        } else if (password.lenght > 22) {
          throw new HttpException('Password should be less than 22 char', 400);
        } else if (
          !/[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,4}/.test(email)
        ) {
          throw new HttpException('Invalid email', 400);
        } else {
          throw new HttpException(err.response, 400);
        }
      }
    }
    return user;
  }
}
