import { Injectable, PipeTransform, Query } from '@nestjs/common';

const PER_PAGE = 10;

type Params = { [key: string]: unknown };

type InputSearchParams<T extends Params> = {
  search?: string;
  sort?: string;
  page?: string;
  perPage?: string;
} & {
  [P in keyof T]?: string | string[];
};

export type SearchParams<T extends Params> = {
  search?: string;
  sort?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  perPage?: number;
} & T;

export type SearchParamsConverter<T extends Params> = (
  params: InputSearchParams<T>,
) => T;

@Injectable()
class SearchParamsPipe<T extends Params>
  implements PipeTransform<InputSearchParams<T>, SearchParams<T>>
{
  constructor(private convert: (para: InputSearchParams<T>) => T) {}

  transform(value: InputSearchParams<T>): SearchParams<T> {
    const { search, sort, page, perPage } = value;

    return {
      search,
      sort,
      page: Number.parseInt(page, 10) || 0,
      perPage: Number.parseInt(perPage, 10) || PER_PAGE,
      sortDirection: sort?.startsWith('-') ? 'DESC' : 'ASC',
      ...this.convert(value),
    };
  }
}

export function SearchParamsQuery<T extends Params>(
  converter: SearchParamsConverter<T> = (params) => params as T,
) {
  return Query(new SearchParamsPipe<T>(converter));
}
