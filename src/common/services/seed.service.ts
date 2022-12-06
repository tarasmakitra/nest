import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { UserService } from 'src/user/services/user.service';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { CreateUserInput } from 'src/user/inputs/create-user.input';
import { PageService } from 'src/page/services/page.service';
import { CreatePageInput } from 'src/page/inputs/createPage.input';
import { EntityManager } from 'typeorm';
import { PostCategory } from '../../post/entities/postCategory.entity';
import { CreatePostCategoryInput } from '../../post/inputs/createPostCategory.input';
import { PostCategoryStatus } from '../../post/interfaces/postCategory.interface';
import { CreatePostInput } from '../../post/inputs/createPost.input';
import { Post } from '../../post/entities/post.entity';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { Page } from '../../page/entities/page.entity';
import { Permission } from 'src/user/entities/permission.entity';

function getRandom(values: number[]) {
  return values[Math.floor(Math.random() * values.length)];
}

function fakeUser(): Required<CreateUserInput> {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    active: faker.datatype.boolean(),
    confirmed: faker.datatype.boolean(),
    subscribed: faker.datatype.boolean(),
    password: faker.random.words(3),
  };
}

function fakePage(users: number[]): Required<CreatePageInput> {
  const title = faker.lorem.sentences(1).replace('.', '');
  return {
    title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    content: faker.lorem.sentences(10),
    published: faker.datatype.boolean(),
    author: {
      id: getRandom(users),
    },
  };
}

function fakePost(
  users: number[],
  categories: number[],
): Required<CreatePostInput> {
  const title = faker.lorem.sentences(1).replace('.', '');
  return {
    title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    content: faker.lorem.sentences(8),
    published: faker.datatype.boolean(),
    category: {
      id: getRandom(categories),
    },
    author: {
      id: getRandom(users),
    },
  };
}

function fakePostCategory(): Required<CreatePostCategoryInput> {
  const title = faker.lorem.sentences(1).replace('.', '');
  return {
    title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    description: faker.lorem.sentences(4),
    status: faker.datatype.boolean()
      ? PostCategoryStatus.Published
      : PostCategoryStatus.Draft,
  };
}

const MULTIPLIER = 100;

const USERS = 100;
const PAGES = 10;
const POST_CATEGORIES = 1;
const POSTS = 20;

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly pageService: PageService,
    private readonly entityManager: EntityManager,
  ) {}

  insert<T>(
    entity: EntityTarget<T>,
    count: number,
    faker: (...args) => any,
    fakerArgs: any[] = [],
  ) {
    const values = [];
    for (let i = 0; i < count * MULTIPLIER; i++) {
      values.push(faker(...fakerArgs));
    }

    this.entityManager
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(values)
      .execute()
      .then(() => {
        console.log(`Entities have been added`);
      })
      .catch(() => {
        // console.log();
      });
  }

  async getEntityIDs<T>(entity: EntityTarget<T>, alias: string) {
    return (
      await this.entityManager
        .createQueryBuilder()
        .select(`${alias}.id`)
        .from(entity, alias)
        .getMany()
    ).map(({ id }: any) => id);
  }

  async createPermissions() {
    await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values([
        { feature: 'post', level: 1023 },
        { feature: 'page', level: 1023 },
        { feature: 'user', level: 1023 },
      ])
      .execute()
      .then(() => {
        console.log(`Entities have been added`);
      })
      .catch(() => {
        // console.log();
      });
  }

  async getPermissions() {
    return await this.entityManager
      .createQueryBuilder()
      .select('permissions')
      .from(Permission, 'permissions')
      .getMany();
  }

  async seed(): Promise<void> {
    try {
      if ((await this.getPermissions()).length === 0) {
        await this.createPermissions();
      }

      const permissions = await this.getPermissions();

      const admin = await this.userService.create({
        username: 'admin',
        email: 'admin@email.com',
        active: true,
        confirmed: true,
        subscribed: true,
        password: 'qwerty',
      });

      admin.permissions = permissions;
      this.entityManager.save(admin);
    } catch {
      console.info('Admin user account already exists.');
    }

    // Creating Entities
    this.insert(User, USERS, fakeUser);

    const userIDs = await this.getEntityIDs(User, 'user');

    this.insert(Page, PAGES, fakePage, [userIDs]);
    this.insert(PostCategory, POST_CATEGORIES, fakePostCategory);

    const postCategoryIDs = await this.getEntityIDs(PostCategory, 'category');

    this.insert(Post, POSTS, fakePost, [userIDs, postCategoryIDs]);
  }
}
