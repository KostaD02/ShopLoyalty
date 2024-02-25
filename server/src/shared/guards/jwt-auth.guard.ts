import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { UserPayload } from 'src/interfaces';
import { User, UserDocument } from 'src/schemas';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException('Token not found', 401);
    }
    let decoded: UserPayload;
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_SECRET}`,
      });
    } catch (err) {
      const errorName = err.name || '';
      if (errorName === 'TokenExpiredError') {
        throw new HttpException(
          `Token expired, expired at: ${err.expiredAt}`,
          400,
        );
      } else {
        throw new HttpException('Invalid token', 400);
      }
    }
    const user = await this.userModel.findOne({ email: decoded.email });
    if (!user) {
      throw new HttpException('Token contains incorrect user', 404);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    const accessTokenCookie = request.cookies.access_token;
    let accessToken: string;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    } else if (accessTokenCookie) {
      accessToken = accessTokenCookie;
    }
    return accessToken;
  }
}
