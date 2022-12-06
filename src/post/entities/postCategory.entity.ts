import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import JsonTransformer from 'src/common/utils/json.transformer';
import {
  PostCategoryInterface,
  PostCategoryStatus,
} from '../interfaces/postCategory.interface';
import { Post } from './post.entity';

@Entity()
@JsonTransformer()
export class PostCategory implements PostCategoryInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  title: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column('text', { select: false })
  description: string;

  @Column({ type: 'enum', enum: PostCategoryStatus })
  status: PostCategoryStatus;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
