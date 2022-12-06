import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { CreatePostInput } from 'src/post/inputs/createPost.input';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { SearchParams } from '../../common/pipes/searchParams.pipe';
import { Action } from '../../auth/services/ability.service';
import { PermissionService } from '../../auth/services/permission.service';

interface DataService<T> {
  getRepository(): Repository<T>;
}

export type PostSearchParams = { category: number[] };

@Injectable()
export class PostService implements DataService<Post> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly permissionService: PermissionService,
  ) {}

  getRepository() {
    return this.postRepository;
  }

  getQueryBuilder(alias = 'post'): SelectQueryBuilder<Post> {
    return this.getRepository()
      .createQueryBuilder(alias)
      .select(['post', 'author', 'category'])
      .leftJoin('post.author', 'author')
      .leftJoin('post.category', 'category');
  }

  async search({
    page = 0,
    perPage = 20,
    search,
    sort,
    sortDirection,
    category,
  }: SearchParams<PostSearchParams>): Promise<Post[]> {
    console.warn({ category });

    const query = this.getQueryBuilder()
      .andWhere('post.title like :search', { search }) // TODO %search% sanitize ?
      // .andWhere('post.published = :published', { published: true })
      .orderBy(sort, sortDirection);

    if (category?.length) {
      query.andWhere('category.slug IN (:...categories)', {
        categories: category,
      });
    }

    const canDelete = this.permissionService.can(Action.DeleteEny, 'post');

    console.log('request', { canDelete });

    return query
      .take(perPage)
      .skip(page * perPage)
      .getMany();
  }

  async findOneById(postId: string): Promise<Post> {
    return this.getQueryBuilder()
      .where('post.id = :postId', { postId })
      .getOne();
  }

  async create(data: CreatePostInput): Promise<Post> {
    return this.getRepository().save(data);
  }

  // TODO update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(pageId: string): Promise<void> {
    await this.getRepository().delete(pageId);
  }
}
