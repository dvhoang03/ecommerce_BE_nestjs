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
import { CategotyService } from './categoty.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { CreateCategoryDTO } from './dto/category.dto';
import { DeleteCategoryDTO } from './dto/deleteCatogoryDTO.dto';

@ApiTags('Category')
@Controller('categoty')
export class CategotyController {
  constructor(private readonly categotyService: CategotyService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all category' })
  @Get()
  getAll(): Promise<Category[]> {
    return this.categotyService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get detail catetgory' })
  @ApiParam({ name: 'id', description: 'categoryid', example: 1 })
  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categotyService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create category' })
  @Post()
  createCategory(@Body() category: CreateCategoryDTO) {
    return this.categotyService.create(category);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update category' })
  @ApiParam({ name: 'id', description: 'id of category', example: 1 })
  @Patch(':id')
  updateCategory(
    @Body() request: CreateCategoryDTO,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    return this.categotyService.update(id, request);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'xoa category, neu co product thi se khong xoa' })
  @ApiParam({ name: 'id', description: 'delete id', example: 1 })
  @Delete(':id')
  deleteCategory(@Param() request: DeleteCategoryDTO): Promise<boolean> {
    const { id } = request;
    return this.categotyService.delete(id);
  }
}
