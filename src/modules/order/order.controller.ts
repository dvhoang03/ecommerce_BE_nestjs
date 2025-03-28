import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOAuth2, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Order } from './entities/order.entiy';
import { GetUser } from 'src/decorator/user.decorator';
import { OrderDTO } from './dto/order.dto';
import { User } from '../users/entities/user.entity';

@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrderService) { }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all order of user' })
  @Get()
  getall(@GetUser() user): Promise<Order[]> {
    return this.orderService.getAll(user)
  }

  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  @ApiOperation({ summary: 'get detail order of user' })
  @Get(':id')
  getdetail(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.orderService.getdetail(id)
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create order user' })
  @Post()
  createOrder(@Body() orderDTO: OrderDTO, @GetUser() user): Promise<Order> {
    return this.orderService.createOrder(orderDTO, user)
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update status order user' })
  @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  @Patch(':id')
  updateOrder(@Body('status') status: string, @Param('id', ParseIntPipe) id: number) {
    return this.orderService.updateStatus(id, status);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete  order user' })
  @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  @Delete(':id')
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }

}
