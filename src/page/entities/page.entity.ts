import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PageInterface } from 'src/page/interfaces/page.interface';
import JsonTransformer from 'src/common/utils/json.transformer';

@Entity()
@JsonTransformer()
export class Page implements PageInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  title: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  published: boolean;

  @ManyToOne(() => User, (user) => user.pages)
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
