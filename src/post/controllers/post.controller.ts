import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Action } from 'src/auth/services/ability.service';
import { Post as PostEntity } from 'src/post/entities/post.entity';
import { Can } from 'src/auth/decorators/can.decorator';
import { User as CurrentUser } from 'src/auth/decorators/user.decorator';

import {
  SearchParams,
  SearchParamsConverter,
  SearchParamsQuery,
} from '../../common/pipes/searchParams.pipe';
import { UserInterface } from '../../user/interfaces/user.interface';
import { PostSearchParams, PostService } from '../services/post.service';
import { CreatePostInput } from '../inputs/createPost.input';

const SORT = {
  title: 'post.title',
};

const converter: SearchParamsConverter<PostSearchParams> = ({
  sort,
  category,
}) => ({
  category: category as unknown as number[], // TODO
  sort: sort in SORT ? SORT[sort] : 'post.id', // TODO solve '-sort' issue
});

@Controller({
  version: '1',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Can([Action.View, 'post'])
  async findAll(
    @SearchParamsQuery(converter) params: SearchParams<PostSearchParams>,
  ) {
    return this.postService.search(params);
  }

  @Get(':id')
  @Can([Action.View, 'post'])
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserInterface,
  ): Promise<PostEntity> {
    return this.postService.findOneById(id);
  }

  @Post('read.user')
  @Can([Action.Create, 'post'])
  create(@Body() data: CreatePostInput) {
    return this.postService.create(data);
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
    return this.postService.remove(id);
  }
}
