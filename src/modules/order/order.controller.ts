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
import { OrderService } from './order.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOAuth2,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Order } from './entities/order.entiy';
import { GetUser } from 'src/decorator/user.decorator';
import { DeleteOrderDTO, OrderDTO, OrderUpdate } from './dto/order.dto';
import { User } from '../users/entities/user.entity';
import { OrderItem } from '../order-item/entities/orderItem.entity';
import { CreateDirectOrderDTO } from './dto/createDirectOrder.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all order of user' })
  @Get()
  getall(@GetUser() user): Promise<Order[]> {
    return this.orderService.getAll(user);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get detail order of user' })
  @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  @Get(':id')
  getdetail(@Param('id', ParseIntPipe) id: number): Promise<OrderItem[]> {
    return this.orderService.getdetailOrder(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'tao order, orderItem, ap ma giam gia. Loi neu code khong hop le hoac so luong cartItem > product.quantity',
  })
  @Post()
  createOrder(@Body() orderDTO: OrderDTO, @GetUser() user): Promise<Order> {
    return this.orderService.createOrder(orderDTO, user);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'tao order, orderItem truc tiep. Loi neu code khong hop le hoac so luong cartItem > product.quantity',
  })
  @Post('/direct')
  createDirectOrder(
    @Body() directOrderDTO: CreateDirectOrderDTO,
    @GetUser() user,
  ): Promise<Order> {
    return this.orderService.createDirectOrder(directOrderDTO, user);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update status order user' })
  @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  @Patch(':id')
  updateOrder(
    @Body() request: OrderUpdate,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log(request);
    const { status } = request;
    return this.orderService.updateStatus(id, status);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'delete  order va cap nhat quantity product, loi neu order khong phai laf pending',
  })
  @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  @Delete(':id')
  deleteOrder(@Param() request: DeleteOrderDTO) {
    const { id } = request;
    return this.orderService.deleteOrder(id);
  }
}
