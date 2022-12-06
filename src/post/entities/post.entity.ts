import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PostInterface } from 'src/post/interfaces/post.interface';
import JsonTransformer from 'src/common/utils/json.transformer';
import { PostCategory } from './postCategory.entity';

@Entity()
@JsonTransformer()
export class Post implements PostInterface {
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

  @ManyToOne(() => PostCategory, (postCategory) => postCategory.posts)
  category: PostCategory;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
