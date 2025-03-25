import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'get all product'})
  @Get()
  getAll(): Promise<Product[]>{
    return this.productService.getAll();
  }


  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'create product'})
  @Post()
  createProduct(@Body() product: CreateProductDTO ):Promise<Product>{
    return  this.productService.createPorduct(product);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'get detail product'})
  @ApiParam({name:'id', description: 'id of product', example: 1})
  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number ): Promise<Product | null>{
    return this.productService.getDetail(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'delete product'})
  @ApiParam({name: 'id', description: 'id of product', example: 1})
  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<any>{
    return this.productService.delete(id);
  }
}
