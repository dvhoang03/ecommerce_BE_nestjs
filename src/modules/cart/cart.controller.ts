import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all cart' })
  @Get()
  getAll() {
    return this.cartService.getAll();
  }
}
