export interface PageInterface {
  id?: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
