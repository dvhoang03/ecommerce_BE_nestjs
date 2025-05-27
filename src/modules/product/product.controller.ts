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
  BadRequestException,
  Res,
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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DeleteProductDTO } from './dto/deleteProductSTO.dto';
import { UpdateProductDTO } from './dto/updateProduct.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { MinioService } from '../minio/minio.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private minioService: MinioService,
  ) {}

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
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF)'), false);
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          return cb(new Error('File ảnh vượt quá 5MB'), false);
        }
        cb(null, true);
      },
    }),
  )
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
    @Body() product: UpdateProductDTO,
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

  @ApiBearerAuth('access-token')
  @Get('/image/resize/:filename')
  async getReSizeImage(
    @Param('filename') filename: string,
    @Query('width') width: number,
    @Query('height') height: number,
    @Res() res: Response,
  ) {
    console.log('lay anh resize', filename, width, height);
    try {
      const resizedImage = await this.minioService.getResizeImage(
        filename,
        +width,
        +height,
      );

      res.setHeader('Content-Type', 'image/jpeg'); // Hoặc image/png tùy loại ảnh
      res.send(resizedImage); // ✅ Gửi ảnh về cho client
    } catch (error) {
      console.error('Lỗi resize ảnh:', error);
      res.status(500).send('Resize image failed');
    }
  }
}
