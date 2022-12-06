import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from 'src/page/entities/page.entity';
import { CreatePageInput } from 'src/page/inputs/createPage.input';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { SearchParams } from '../../common/pipes/searchParams.pipe';
import { Action } from '../../auth/services/ability.service';
import { PermissionService } from '../../auth/services/permission.service';

interface DataService<T> {
  getRepository(): Repository<T>;
}

export type PageSearchParams = { type: number };

@Injectable()
export class PageService implements DataService<Page> {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    private readonly permissionService: PermissionService,
  ) {}

  getRepository() {
    return this.pageRepository;
  }

  getQueryBuilder(alias = 'page'): SelectQueryBuilder<Page> {
    return this.getRepository()
      .createQueryBuilder(alias)
      .select(['page', 'author'])
      .leftJoin('page.author', 'author');
  }

  async search({
    page = 0,
    perPage = 20,
    search,
    sort,
    sortDirection,
    type,
  }: SearchParams<PageSearchParams>): Promise<Page[]> {
    const query = this.getQueryBuilder()
      .andWhere('page.title like :search', { search }) // TODO %search% sanitize ?
      // .andWhere('page.published = :published', { published: true })
      .orderBy(sort, sortDirection);

    const canDelete = this.permissionService.can(Action.DeleteEny, 'page');

    console.log('request', { canDelete });

    return query
      .take(perPage)
      .skip(page * perPage)
      .getMany();
  }

  async findOneById(pageId: string): Promise<Page> {
    return this.getQueryBuilder()
      .where('page.id = :pageId', { pageId })
      .getOne();
  }

  async create(data: CreatePageInput): Promise<Page> {
    return this.getRepository().save(data);
  }

  // TODO update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(pageId: string): Promise<void> {
    await this.getRepository().delete(pageId);
  }
}
