import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Action } from 'src/auth/services/ability.service';
import { Can } from 'src/auth/decorators/can.decorator';
import {
  SearchParams,
  SearchParamsQuery,
} from '../../common/pipes/searchParams.pipe';
import { PostCategoryService } from '../services/postCategory.service';
import { PostCategory } from '../entities/postCategory.entity';
import { CreatePostCategoryInput } from '../inputs/createPostCategory.input';

@Controller({
  version: '1',
  path: 'categories',
})
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Get()
  @Can([Action.View, 'page'])
  async findAll(@SearchParamsQuery() params: SearchParams<any>) {
    return this.postCategoryService.search(params);
  }

  @Get(':id')
  @Can([Action.View, 'page'])
  async findOne(@Param('id') id: string): Promise<PostCategory> {
    return this.postCategoryService.findOneById(id);
  }

  @Post('read.user')
  @Can([Action.Create, 'page'])
  create(@Body() data: CreatePostCategoryInput) {
    return this.postCategoryService.create(data);
  }

  // @Patch(':id')
  // @Can([ Action.Update, User ])
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return { success: true };
  //   // return this.pageService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  @Can([Action.Delete, 'page'])
  remove(@Param('id') id: string) {
    return this.postCategoryService.remove(id);
  }
}
