import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from 'src/user/entities/permission.entity';
import { Page } from 'src/page/entities/page.entity';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { Exclude } from 'class-transformer';
import JsonTransformer from 'src/common/utils/json.transformer';
import { Post } from '../../post/entities/post.entity';

@Entity()
@JsonTransformer()
export class User implements UserInterface {
  // static get modelName() {
  //   return 'User';
  // }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 128, unique: true, select: false })
  email: string;

  @Column({ length: 64 })
  username: string;

  @Column({ default: false, select: false })
  active: boolean;

  @Column({ default: false, select: false })
  confirmed: boolean;

  @Column({ default: false, select: false })
  subscribed: boolean;

  @Exclude()
  @Column({ length: 72, nullable: true, select: false })
  hashedPassword?: string;

  @CreateDateColumn({ nullable: true, select: false })
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true, select: false })
  updatedAt?: Date;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'user_permissions' })
  // @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];

  @OneToMany(() => Page, (page) => page.author)
  pages: Page[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
