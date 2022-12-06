import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserInterface } from 'src/user/interfaces/user.interface';

export class UpdateUserInput implements Partial<UserInterface> {
  @IsEmail()
  @MaxLength(128)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsBoolean()
  active?: boolean;

  @IsBoolean()
  confirmed?: boolean;

  @IsBoolean()
  subscribed?: boolean;
}
