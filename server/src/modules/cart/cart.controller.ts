import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UserPayload } from 'src/interfaces';
import { JwtGuard, CurrentUserInterceptor, CurrentUser } from 'src/shared';
import { CartDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCurrentCart(@CurrentUser() user: UserPayload) {
    return this.cartService.getCurrentCart(user);
  }

  @Patch()
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  addProduct(@CurrentUser() user: UserPayload, @Body() productDto: CartDto) {
    return this.cartService.addProduct(user, productDto);
  }

  @Post('checkout')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  checkout(@CurrentUser() user: UserPayload) {
    return this.cartService.checkout(user);
  }

  @Delete('id/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  removeSingleItem(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.cartService.removeSingleItem(user, id);
  }

  @Delete('clear')
  @UseGuards(JwtGuard)
  @UseInterceptors(CurrentUserInterceptor)
  clearCart(@CurrentUser() user: UserPayload) {
    return this.cartService.clearCart(user);
  }
}
