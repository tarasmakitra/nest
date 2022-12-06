export enum PostCategoryStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
}

export interface PostCategoryInterface {
  id?: number;
  title: string;
  slug: string;
  description: string;
  status: PostCategoryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
