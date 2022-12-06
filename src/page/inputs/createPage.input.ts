import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

import { PageInterface } from 'src/page/interfaces/page.interface';

export class CreatePageInput implements Partial<PageInterface> {
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

  author: { id: number };
}
