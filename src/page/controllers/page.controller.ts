import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { Action } from 'src/auth/services/ability.service';
import { Page } from 'src/page/entities/page.entity';
import { Can } from 'src/auth/decorators/can.decorator';
import { User as CurrentUser } from 'src/auth/decorators/user.decorator';
import { PageSearchParams, PageService } from 'src/page/services/page.service';
import { CreatePageInput } from 'src/page/inputs/createPage.input';

import {
  SearchParams,
  SearchParamsConverter,
  SearchParamsQuery,
} from '../../common/pipes/searchParams.pipe';
import { UserInterface } from '../../user/interfaces/user.interface';

const SORT = {
  title: 'page.title',
};

const converter: SearchParamsConverter<PageSearchParams> = ({
  sort,
  type,
}) => ({
  type: Number(type),
  sort: sort in SORT ? SORT[sort] : 'page.id', // TODO solve '-sort' issue
});

@Controller({
  version: '1',
})
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  @Can([Action.View, 'page'])
  async findAll(
    @SearchParamsQuery(converter) params: SearchParams<PageSearchParams>,
  ) {
    return this.pageService.search(params);
  }

  @Get(':id')
  @Can([Action.View, 'page'])
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserInterface,
  ): Promise<Page> {
    return this.pageService.findOneById(id);
  }

  @Post('read.user')
  @Can([Action.Create, 'page'])
  create(@Body() data: CreatePageInput) {
    return this.pageService.create(data);
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
    return this.pageService.remove(id);
  }
}
