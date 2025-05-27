import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CartItem } from './entities/cartItem.entity';
import { CreateCartItemDTO, UpdateCartItemDTO } from './dto/cartItem.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { Public } from 'public/jwt-public';

@ApiTags('CartItem')
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all cartItem of user' })
  @Get()
  getAll(@GetUser() user): Promise<CartItem[]> {
    return this.cartItemService.getAll(user.id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all cartItem of user' })
  @Get(':id')
  @Public()
  getdetail(@Param('id') id: number): Promise<CartItem> {
    return this.cartItemService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'tạo cartItem, nếu có thì cập nhật, lôi nếu số lượng cartItem lớn hơn số lượng product còn lại ',
  })
  @Post()
  addCartItem(
    @GetUser() user,
    @Body() createCartitem: CreateCartItemDTO,
  ): Promise<CartItem> {
    return this.cartItemService.create(createCartitem, user.id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'update cartItem, lôi nếu số lượng cartItem lớn hơn số lượng product còn lại ',
  })
  @ApiParam({ name: 'id', description: 'id of cartItem', example: 1 })
  @Patch(':id')
  updateCartItem(
    @GetUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() cartItem: UpdateCartItemDTO,
  ): Promise<CartItem> {
    cartItem.productId = id;
    return this.cartItemService.updateCartItem(user.id, id, cartItem);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete cartItem' })
  @ApiParam({ name: 'id', description: 'id of cartItem', example: 1 })
  @Delete(':id')
  deleteCartItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.delete(id);
  }
}
