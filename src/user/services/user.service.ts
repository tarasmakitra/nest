import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PasswordService } from 'src/auth/services/password.service';
import { CreateUserInput } from 'src/user/inputs/create-user.input';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { SearchParams } from '../../common/pipes/searchParams.pipe';
import { UpdateUserInput } from '../inputs/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  getRepository() {
    return this.usersRepository;
  }

  getQueryBuilder(alias = 'user'): SelectQueryBuilder<User> {
    return this.getRepository()
      .createQueryBuilder(alias)
      .addSelect([
        'user.email',
        'user.active',
        'user.confirmed',
        'user.createdAt',
      ]);
  }

  async search({
    page = 0,
    perPage = 20,
    search,
    sort,
    sortDirection,
    type,
  }: SearchParams<{ type?: 'active' | 'deactivated' }>): Promise<{
    data: User[];
    total: number;
  }> {
    const query = this.getQueryBuilder();

    if (search) {
      query.andWhere('user.username like :search', { search: `%${search}%` }); // TODO %search% sanitize ?
    }

    if (['active', 'deactivated'].includes(type)) {
      query.andWhere('user.active = :active', { active: type === 'active' });
    }

    // if (category?.length) {
    //   query.andWhere('category.slug IN (:...categories)', {
    //     categories: category,
    //   });
    // }

    console.log({ type });

    const [data, total] = await query
      .orderBy(sort, sortDirection)
      .take(perPage)
      .skip(page * perPage)
      .getManyAndCount();

    return { data, total };
  }

  async findAll(): Promise<User[]> {
    return this.getQueryBuilder().getMany();
  }

  async findOneById(id: string, addSelect: string[] = []): Promise<User> {
    return this.getQueryBuilder()
      .where('id = :id', { id })
      .addSelect(addSelect)
      .getOne();
  }

  async findOneByEmail(email: string, addSelect: string[] = []): Promise<User> {
    return this.getQueryBuilder()
      .where('email = :email', { email })
      .addSelect(addSelect)
      .getOne();
  }

  async create(data: CreateUserInput): Promise<User> {
    const hashedPassword = await this.passwordService.hash(data.password);
    return this.usersRepository.save(
      this.usersRepository.create({ ...data, hashedPassword }),
    );
  }

  async update(id: number, input: UpdateUserInput) {
    const entity = await this.usersRepository.findOneOrFail({ id });
    return this.usersRepository.save(Object.assign(entity, input));
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
