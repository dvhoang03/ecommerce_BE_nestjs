import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CartItem } from './entities/cartItem.entity';
import { CreateCartItemDTO, UpdateCartItemDTO } from './dto/cartItem.dto';
import { GetUser } from 'src/decorator/user.decorator';

@ApiTags('CartItem')
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) { }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all cartItem of user' })
  @Get()
  getAll(@GetUser() user): Promise<CartItem[]> {
    return this.cartItemService.getAll(user.id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'add cartItem in cart' })
  @Post()
  addCartItem(@GetUser() user, @Body() cartitem: CreateCartItemDTO): Promise<CartItem> {
    return this.cartItemService.createCartItem(user.id, cartitem);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update cartItem ' })
  @ApiParam({ name: 'id', description: 'id of cartItem', example: 1 })
  @Patch(':id')
  updateCartItem(@GetUser() user, @Param('id', ParseIntPipe) id: number, @Body() cartItem: UpdateCartItemDTO): Promise<CartItem> {
    return this.cartItemService.updateCartItem(user.id, id, cartItem);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete cartItem' })
  @ApiParam({ name: 'id', description: 'id of cartItem', example: 1 })
  @Delete(':id')
  deleteCartItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.deleteCartItem(id);
  }


}
