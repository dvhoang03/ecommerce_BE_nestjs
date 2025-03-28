// src/modules/product/product.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors, UploadedFiles, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/product.dto';
import { UpdateProductDTO } from './dto/updateproduct.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // get all product
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all products' })
  @Get()
  getAll(): Promise<Product[]> {
    return this.productService.getAll();
  }

  // find product 
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get product details' })
  @ApiParam({ name: 'id', description: 'ID of the product', example: 1 })
  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<Product | null> {
    return this.productService.getDetail(id);
  }

  //create product
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get product details' })
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new product with images',
    type: CreateProductDTO,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  createProduct(
    @Body() product: CreateProductDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    console.log('File path:', files);
    return this.productService.createPorduct(product, files);
  }


  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'ID of the product', example: 1 })
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update a product with optional images',
    type: UpdateProductDTO,
  })
  @UsePipes(new ValidationPipe({ transform: true })) // Thêm ValidationPipe với transform: true
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product | null> {
    console.log('File path:', files);
    return this.productService.updatePorduct(product, id, files);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'ID of the product', example: 1 })
  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.productService.delete(id);
  }
}