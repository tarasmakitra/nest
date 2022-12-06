import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';
import { PostInterface } from '../interfaces/post.interface';

export class CreatePostInput implements Partial<PostInterface> {
  @IsNotEmpty()
  @MaxLength(128)
  title: string;

  @IsNotEmpty()
  @MaxLength(128)
  slug: string;

  @IsNotEmpty()
  @MaxLength(128)
  content: string;

  @IsBoolean()
  published?: boolean;

  category: { id: number };
  author: { id: number };
}
