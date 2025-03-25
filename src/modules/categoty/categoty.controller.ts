import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategotyService } from './categoty.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { CategoryDTO } from './dto/category.dto';

@ApiTags('Category')
@Controller('categoty')
export class CategotyController {
  constructor(private readonly categotyService: CategotyService) {};

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'get all category'})
  @ApiResponse({status:200, description: 'get all success'})
  @Get()
  getAll(): Promise<Category[]>{
    return this.categotyService.getAll();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'get detail catetgory'})
  @ApiParam({name: 'id', description: 'categoryid', example:1})
  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<Category | null>{
    return this.categotyService.getDetail(id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'create category'})
  @Post()
  createCategory(@Body() category: CategoryDTO){
    return this.categotyService.createCategory(category);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({summary: 'update category'})
  @ApiParam({name: 'id', description: 'id of category', example: 1})
  @Patch(':id')
  updateCategory(@Body() cate: CategoryDTO, @Param('id', ParseIntPipe) id: number): Promise<Category | null>{
    return this.categotyService.updateCategory(cate , id);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({summary:'delete cate'})
  @ApiParam({name:'id', description: 'delete id', example: 1})
  @Delete(':id')
  deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<Category | null>{
    return this.deleteCategory(id);
  }



}
