// src/modules/product/product.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/createProduct.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeleteProductDTO } from './dto/deleteProductSTO.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // get all product
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({
    name: 'categoryId',
    description: 'Filter by category ID',
    required: false,
  })
  @ApiQuery({
    name: 'minPrice',
    description: 'Filter by min price',
    required: false,
  })
  @ApiQuery({
    name: 'maxPrice',
    description: 'Filter by max price',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    description: 'Search by keyword',
    required: false,
  })
  @ApiQuery({ name: 'page', description: 'go to page?', required: false })
  @ApiQuery({ name: 'pageSize', description: 'pageSize =?', required: false })
  @Get()
  async getAll(
    @Query('categoryId') categoryId?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Product[]> {
    return this.productService.getFilteredProducts(
      categoryId,
      minPrice,
      maxPrice,
      search,
      page,
      pageSize,
    );
  }

  // find product
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get product details' })
  @ApiParam({ name: 'id', description: 'ID of the product', example: 1 })
  @Get(':id')
  async getDetail(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  //create product
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create product' })
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  async createProduct(
    @Body() product: CreateProductDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log('File path:', files);
    return this.productService.create(product, files);
  }

  //update product
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'ID of the product', example: 1 })
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log('File path:', files);
    return this.productService.update(id, product, files);
  }

  // delete product
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'xoa product, khong the xoa neu có orderitem hoạc cartitem',
  })
  @ApiParam({ name: 'id', description: 'ID of the product', example: 1 })
  @Delete(':id')
  async deleteProduct(@Param() request: DeleteProductDTO): Promise<boolean> {
    const { id } = request;
    return this.productService.delete(id);
  }
}
