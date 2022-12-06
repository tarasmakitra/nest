import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionInterface } from '../interfaces/permission.interface';
import { PermissionFeature } from '../../common/types/permissionFeature';

@Entity()
export class Permission implements PermissionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.permissions, { nullable: false })
  // @ManyToOne(() => User, (user) => user.permissions, { nullable: false })
  // users: User;

  // @Column()
  // permission: string;

  @Column({
    type: 'enum',
    enum: ['user', 'page', 'post'] as PermissionFeature[],
  })
  feature: PermissionFeature;

  @Column({ type: 'mediumint' })
  level: number;
}
