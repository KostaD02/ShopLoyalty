import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, UpdateProductDto } from '../dtos';
import { UserRole } from 'src/enums';
import { JwtGuard, RolesGuard, Roles } from 'src/shared';

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
  updateProduict(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto);
  }
}
