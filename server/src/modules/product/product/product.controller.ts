import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ProductDto,
  UpdateProductDto,
  UpdateProductDiscountsDto,
} from '../dtos';
import { UserRole } from 'src/enums';
import { JwtGuard, RolesGuard, Roles } from 'src/shared';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('all')
  getAllProducts() {
    return this.productService.getAllProduct();
  }

  @Get('id/:id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post('create')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.Admin)
  createProduct(@Body() productDto: ProductDto) {
    return this.productService.createProduct(productDto);
  }

  @Patch('update')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.Admin)
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto);
  }

  @Patch('update_discounts')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.Admin)
  updateProductDiscounts(
    @Body() updateProductDiscountsDto: UpdateProductDiscountsDto,
  ) {
    return this.productService.updateProductDiscounts(
      updateProductDiscountsDto,
    );
  }

  @Delete('delete/id/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.Admin)
  deleteProductById(@Param('id') id: string) {
    return this.productService.deleteProductById(id);
  }
}
