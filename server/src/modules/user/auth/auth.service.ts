import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas';
import { EncryptionService, MongooseValidatorService } from 'src/shared';
import { SignUpDto, UpdateUserDto, UpdateUserPasswordDto } from '../dtos';
import { UserInterface, UserPayload } from 'src/interfaces';
import { Response } from 'express';
import { UserRole } from 'src/enums';
import { PurchasedProductsService } from 'src/modules/product';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private purchasedProduct: PurchasedProductsService,
    private encryptionService: EncryptionService,
    private jwtService: JwtService,
    private mongooseValidator: MongooseValidatorService,
  ) {}

  async signUp(body: SignUpDto) {
    const userExsists = await this.userModel.findOne({ email: body.email });
    if (userExsists) {
      throw new HttpException('Email is already in use', 409);
    }

    const hashedPassword = await this.encryptionService.hash(body.password);

    const user = await this.userModel.create({
      ...body,
      password: hashedPassword,
      productConnectID: '',
      role: UserRole.Default,
    });

    const connection = await this.purchasedProduct.createConnection(user.id);
    user.productConnectID = connection.id;
    user.save();

    return this.createPayload(user as unknown as UserInterface);
  }

  private createPayload(user: UserInterface) {
    return {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      productConnectID: user.productConnectID,
    };
  }

  async getUsers() {
    const users = await this.userModel.find({});
    return users.map((user) =>
      this.createPayload(user as unknown as UserInterface),
    );
  }

  async getUserByID(userPayload: UserPayload, id: string) {
    if (userPayload._id === id) {
      return this.createPayload(userPayload as unknown as UserInterface);
    }

    this.mongooseValidator.isValidObjectId(id);
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new HttpException(`User with this '${id}' does not exist`, 400);
    }

    return this.createPayload(user as unknown as UserInterface);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (
      user &&
      (await this.encryptionService.compareHash(password, user.password))
    ) {
      return this.createPayload(user as unknown as UserInterface);
    }
    return null;
  }

  async signIn(user: UserPayload, response: Response) {
    const accessToken = this.jwtService.sign(user);
    const refreshToken = this.jwtService.sign(user, { expiresIn: '7d' });
    response.cookie('access_token', accessToken, {
      expires: new Date(
        Date.now() + Number(process.env.JWT_EXPIRES_IN) * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    response.cookie('refresh_token', refreshToken, {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_EXPIRES_IN) * 7 * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(response: Response) {
    let refreshToken = response.getHeader('refresh_token') as string;
    if (!refreshToken) {
      refreshToken = response.req.cookies['refresh_token'];
    }
    if (!refreshToken) {
      refreshToken = response.req.body.refresh_token;
    }
    if (!refreshToken) {
      throw new HttpException('Refresh token not found', 400);
    }
    const data = this.jwtService.decode(refreshToken) as UserPayload;
    const user = await this.userModel.findOne({ email: data.email });
    const accessToken = this.jwtService.sign(
      this.createPayload(user as unknown as UserInterface),
    );
    response.cookie('access_token', accessToken, {
      expires: new Date(
        Date.now() + Number(process.env.JWT_EXPIRES_IN) * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return {
      access_token: accessToken,
    };
  }

  async deleteCurrentUser(userPayload: UserPayload) {
    const user = await this.userModel.findOneAndDelete({
      email: userPayload.email,
    });

    if (!user) {
      throw new HttpException('User already deleted', 400);
    }

    return {
      acknowledged: true,
    };
  }

  async updateUser(userPayload: UserPayload, body: UpdateUserDto) {
    if (!body.name && !body.lastName && !body.email) {
      throw new HttpException(
        `Nothing to update, provide at least one property`,
        400,
      );
    }
    const user = await this.userModel.findOneAndUpdate(
      { email: userPayload.email },
      {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
      },
    );

    const updatedUser = await this.userModel.findOne({ _id: user.id });

    return this.createPayload(updatedUser as unknown as UserInterface);
  }

  async updateUserPassword(
    userPayload: UserPayload,
    body: UpdateUserPasswordDto,
    response: Response,
  ) {
    if (body.newPassword === body.oldPassword) {
      throw new HttpException(`Old and new passwords can not be same`, 400);
    }

    const user = await this.userModel.findOne({ email: userPayload.email });
    const isCorrect = await this.encryptionService.compareHash(
      body.oldPassword,
      user.password,
    );

    if (!isCorrect) {
      throw new HttpException(`Old password is incorrect`, 400);
    }

    const hashedPassword = await this.encryptionService.hash(body.newPassword);
    user.password = hashedPassword;
    await user.save();

    return this.signIn(
      this.createPayload(user as unknown as UserInterface),
      response,
    );
  }
}
