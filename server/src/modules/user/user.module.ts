import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas';
import { RefreshJwtGuard } from './auth/guards';
import { EncryptionService, MongooseValidatorService } from 'src/shared';
import { AuthController, AuthService } from './auth';
import {
  JwtStrategy,
  LocalStrategy,
  RefreshJwtStrategy,
} from './auth/strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN || '1'}h` },
    }),
  ],
  providers: [
    RefreshJwtGuard,
    MongooseValidatorService,
    EncryptionService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class UserModule {}
