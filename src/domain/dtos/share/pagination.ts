import { variables } from '@domain/variables';

export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(
    page: number = variables.PAGINATION_PAGE_DEFAULT,
    limit: number = variables.PAGINATION_LIMIT_DEFAULT
  ): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(limit)) {
      return ['Page and limit must be a number', undefined];
    }

    if (page <= 0) {
      return ['Page must be greaten than 0', undefined];
    }

    if (limit <= 0) {
      return ['Limit must be greaten than 0', undefined];
    }

    return [undefined, new PaginationDto(page, limit)];
  }
}
