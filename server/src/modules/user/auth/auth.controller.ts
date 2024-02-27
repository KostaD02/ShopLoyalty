import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserPayload } from 'src/interfaces';
import {
  JwtGuard,
  CurrentUser,
  CurrentUserInterceptor,
  RolesGuard,
  Roles,
} from 'src/shared';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from '../dtos';
import { LocalAuthGuard, RefreshJwtGuard } from './guards';
import { UserRole } from 'src/enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCurrentUser(@CurrentUser() user: UserPayload) {
    return user;
  }

  @Get('id/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getUserByID(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.authService.getUserByID(user, id);
  }

  @Get('all_user')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.Admin)
  getUsers() {
    return this.authService.getUsers();
  }

  @Post('sign_up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('sign_in')
  @UseGuards(LocalAuthGuard)
  signIn(
    @CurrentUser() user: UserPayload,
    @Res({ passthrough: true }) response: Response,
    @Body() dto: SignInDto,
  ) {
    dto;
    return this.authService.signIn(user, response);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  refreshToken(@Res({ passthrough: true }) response: Response) {
    return this.authService.refreshToken(response);
  }

  @Patch('update')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateUser(@CurrentUser() user: UserPayload, @Body() body: UpdateUserDto) {
    return this.authService.updateUser(user, body);
  }

  @Patch('change_password')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  updateUserPassword(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateUserPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.updateUserPassword(user, body, response);
  }

  @Delete('delete')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  deleteCurrentUser(@CurrentUser() user: UserPayload) {
    return this.authService.deleteCurrentUser(user);
  }
}
