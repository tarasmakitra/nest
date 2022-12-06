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
import { UserService } from 'src/user/services/user.service';
import { CreateUserInput } from 'src/user/inputs/create-user.input';
import { UpdateUserInput } from 'src/user/inputs/update-user.input';
import { Action } from 'src/auth/services/ability.service';
import { User } from 'src/user/entities/user.entity';
import { Can } from 'src/auth/decorators/can.decorator';
import {
  SearchParams,
  SearchParamsConverter,
  SearchParamsQuery,
} from '../../common/pipes/searchParams.pipe';

const SORT = {
  id: 'user.id',
  email: 'user.email',
  active: 'user.active',
  username: 'user.username',
  createdAt: 'user.createdAt',
};

const converter: SearchParamsConverter<any> = ({ type, sort }) => {
  const orderBy = sort.replace('-', '');
  return {
    type,
    sort: orderBy in SORT ? SORT[orderBy] : 'user.id',
    sortDirection: orderBy in SORT && sort.startsWith('-') ? 'DESC' : 'ASC',
  };
};

@Controller({
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Can([Action.View, 'user'])
  async findAll(
    @SearchParamsQuery(converter)
    params: SearchParams<{ type?: 'active' | 'deactivated' }>,
  ) {
    console.log({ params });
    return this.userService.search(params);
  }

  @Get(':id')
  @Can([Action.View, 'user'])
  async findOne(@Param('id') id: string): Promise<User> {
    // TODO validate null|undefined
    return await this.userService.findOneById(id);
  }

  @Post()
  @Can([Action.Create, 'user'])
  create(@Body() input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Patch(':id')
  @Can([Action.Update, 'user'])
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  update(@Param('id') id: string, @Body() input: UpdateUserInput) {
    // return { success: true };
    return this.userService.update(+id, input);
  }

  @Delete(':id')
  @Can([Action.Delete, 'user'])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
