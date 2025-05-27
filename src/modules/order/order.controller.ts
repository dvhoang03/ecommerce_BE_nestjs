import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  ServiceUnavailableException,
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
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('order')
export class OrderController {
  // constructor(private readonly orderService: OrderService) { }

  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'get all order of user' })
  // @Get()
  // getall(@GetUser() user): Promise<Order[]> {
  //   return this.orderService.getAll(user)
  // }

  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'get detail order of user' })
  // @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  // @Get(':id')
  // getdetail(@Param('id', ParseIntPipe) id: number): Promise<OrderItem[]> {
  //   return this.orderService.getdetailOrder(id)
  // }

  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'tao order, orderItem, ap ma giam gia. Loi neu code khong hop le hoac so luong cartItem > product.quantity' })
  // @Post()
  // createOrder(@Body() orderDTO: OrderDTO, @GetUser() user): Promise<Order> {

  //   return this.orderService.createOrder(orderDTO, user)
  // }

  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'tao order, orderItem truc tiep. Loi neu code khong hop le hoac so luong cartItem > product.quantity' })
  // @Post('/direct')
  // createDirectOrder(@Body() directOrderDTO: CreateDirectOrderDTO, @GetUser() user): Promise<Order> {
  //   return this.orderService.createDirectOrder(directOrderDTO, user)
  // }

  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'update status order user' })
  // @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  // @Patch(':id')
  // updateOrder(@Body() request: OrderUpdate, @Param('id', ParseIntPipe) id: number) {
  //   console.log(request)
  //   const { status } = request;
  //   return this.orderService.updateStatus(id, status);
  // }

  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'delete  order va cap nhat quantity product, loi neu order khong phai laf pending' })
  // @ApiParam({ name: 'id', description: 'id of order', example: 1 })
  // @Delete(':id')
  // deleteOrder(@Param() request: DeleteOrderDTO) {
  //   const { id } = request;
  //   return this.orderService.deleteOrder(id);
  // }

  constructor(@Inject('ORDER_SERVICE') private readonly client: ClientProxy) {}

  @ApiBearerAuth('access-token')
  @Get()
  async getAll(@Req() req): Promise<Order[] | undefined> {
    try {
      console.log('lay tat ca order tu microservice');
      return firstValueFrom(
        this.client.send<Order[]>(
          { cmd: 'get_all_orders' },
          { userId: req.user.id },
        ),
      );
    } catch (error) {
      throw new ServiceUnavailableException(
        'service khong co san,  thu lai sau',
      );
    }
  }

  @ApiBearerAuth('access-token')
  @Get(':id')
  async getDetailOrder(@Param('id') id: number): Promise<any> {
    console.log('lay chi tiet order tu microservice');
    return this.client
      .send({ cmd: 'get_order_details' }, { orderId: id })
      .toPromise();
  }

  @ApiBearerAuth('access-token')
  @Post()
  async createOrder(@Body() orderDTO: OrderDTO, @Req() req): Promise<any> {
    console.log('tao order tu microservice');
    return this.client
      .send({ cmd: 'create_order' }, { orderDTO, userId: req.user.id })
      .toPromise();
  }

  @ApiBearerAuth('access-token')
  @Post('direct')
  async createDirectOrder(
    @Body() orderDTO: CreateDirectOrderDTO,
    @Req() req,
  ): Promise<any> {
    console.log('tao  order tu microservice');
    return this.client
      .send({ cmd: 'create_direct_order' }, { orderDTO, userId: req.user.id })
      .toPromise();
  }

  @ApiBearerAuth('access-token')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ): Promise<any> {
    console.log('sua order tu microservice');
    return this.client
      .send({ cmd: 'update_order_status' }, { orderId: id, status })
      .toPromise();
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  async deleteOrder(@Param('id') id: number): Promise<any> {
    console.log('xoa order tu microservice');
    return this.client
      .send({ cmd: 'delete_order' }, { orderId: id })
      .toPromise();
  }
}
