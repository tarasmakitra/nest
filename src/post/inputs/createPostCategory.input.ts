import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import {
  PostCategoryInterface,
  PostCategoryStatus,
} from '../interfaces/postCategory.interface';

export class CreatePostCategoryInput implements Partial<PostCategoryInterface> {
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @IsNotEmpty()
  @MaxLength(128)
  slug: string;

  @IsNotEmpty()
  @MaxLength(128)
  description: string;

  @IsEnum(PostCategoryStatus)
  status?: PostCategoryStatus;
}
