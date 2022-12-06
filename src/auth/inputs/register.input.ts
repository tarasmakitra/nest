import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterInput {
  @IsEmail()
  @MaxLength(128)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsBoolean()
  subscribed: boolean;
}
