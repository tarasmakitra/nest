import { PermissionInterface } from './permission.interface';

export interface UserInterface {
  id?: number;
  email: string;
  username: string;
  active: boolean;
  confirmed: boolean;
  subscribed: boolean;
  hashedPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
  permissions: PermissionInterface[];
  // pages: Page[];
}
