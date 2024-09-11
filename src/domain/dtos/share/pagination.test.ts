import { variables } from '../../variables';
import { PaginationDto } from './pagination';

describe('pagination.ts', () => {
  const page = variables.PAGINATION_PAGE_DEFAULT;
  const limit = variables.PAGINATION_LIMIT_DEFAULT;

  test('should create pagination instance', () => {
    const [error, paginationDto] = PaginationDto.create(page, limit);

    expect(paginationDto).toBeInstanceOf(PaginationDto);
    expect(paginationDto?.limit).toBe(limit);
    expect(paginationDto?.page).toBe(page);

    expect(error).toBeUndefined();
  });

  test('should get a error message if page or limit are not numbers', () => {
    const [error1, resultPage] = PaginationDto.create('page' as any, limit);
    const [error2, resultLimit] = PaginationDto.create(page, 'limit' as any);

    expect(error1).toBe('Page and limit must be a number');
    expect(error2).toBe('Page and limit must be a number');

    expect(resultPage).toBeUndefined();
    expect(resultLimit).toBeUndefined();
  });

  test('should get a error message if page or limit are negatives numbers', () => {
    const [error1, resultPage] = PaginationDto.create(-2, limit);
    const [error2, resultLimit] = PaginationDto.create(page, -2);

    expect(error1).toBe('Page must be greaten than 0');
    expect(error2).toBe('Limit must be greaten than 0');

    expect(resultPage).toBeUndefined();
    expect(resultLimit).toBeUndefined();
  });
});
