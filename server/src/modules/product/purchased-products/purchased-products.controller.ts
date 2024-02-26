import { Controller, Get, Param } from '@nestjs/common';
import { PurchasedProductsService } from './purchased-prodcuts.service';

@Controller('purchased_products')
export class PurchasedProductsController {
  constructor(private purchasedProductsService: PurchasedProductsService) {}

  @Get('id/:id')
  getConnectionByConnectionId(@Param('id') id: string) {
    return this.purchasedProductsService.getConnectionByConnectionId(id);
  }

  @Get('user_id/:id')
  getConnectionByUserId(@Param('id') id: string) {
    return this.purchasedProductsService.getConnectionByUserId(id);
  }
}
