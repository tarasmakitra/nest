import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { SearchParams } from '../../common/pipes/searchParams.pipe';
import { Action } from '../../auth/services/ability.service';
import { PermissionService } from '../../auth/services/permission.service';
import { PostCategory } from '../entities/postCategory.entity';
import { CreatePostCategoryInput } from '../inputs/createPostCategory.input';

interface DataService<T> {
  getRepository(): Repository<T>;
}

// export type PostCategorySearchParams = { type: number };

@Injectable()
export class PostCategoryService implements DataService<PostCategory> {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
    private readonly permissionService: PermissionService,
  ) {}

  getRepository() {
    return this.postCategoryRepository;
  }

  getQueryBuilder(alias = 'category'): SelectQueryBuilder<PostCategory> {
    return this.getRepository().createQueryBuilder(alias);
    // .select(['category', 'author'])
    // .leftJoin('category.author', 'author');
  }

  async search({
    page = 0,
    perPage = 20,
    search,
    sort,
    sortDirection,
  }: SearchParams<any>): Promise<PostCategory[]> {
    const query = this.getQueryBuilder()
      .andWhere('category.title like :search', { search }) // TODO %search% sanitize ?
      // .andWhere('post.published = :published', { published: true })
      .orderBy(sort, sortDirection);

    const canDelete = this.permissionService.can(Action.DeleteEny, 'post');

    console.log('request', { canDelete });

    return query
      .take(perPage)
      .skip(page * perPage)
      .getMany();
  }

  async findOneById(postCategoryId: string): Promise<PostCategory> {
    return this.getQueryBuilder()
      .where('category.id = :postCategoryId', { postCategoryId })
      .getOne();
  }

  async create(data: CreatePostCategoryInput): Promise<PostCategory> {
    return this.getRepository().save(data);
  }

  // TODO update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(pageId: string): Promise<void> {
    await this.getRepository().delete(pageId);
  }
}
