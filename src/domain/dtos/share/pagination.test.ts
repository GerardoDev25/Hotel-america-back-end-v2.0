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
    
    const resultPage = PaginationDto.create('page' as unknown as number, limit);
    const resultLimit = PaginationDto.create(page, 'limit' as unknown as number);

    expect(resultPage[0]).toBe('Page and limit must be a number');
    expect(resultLimit[0]).toBe('Page and limit must be a number');

    expect(resultPage[1]).toBeUndefined();
    expect(resultLimit[1]).toBeUndefined();
    
   })

  test('should get a error message if page or limit are negatives numbers', () => { 
    
    const resultPage = PaginationDto.create(-2, limit);
    const resultLimit = PaginationDto.create(page, -2);

    expect(resultPage[0]).toBe('Page must be greaten than 0');
    expect(resultLimit[0]).toBe('Limit must be greaten than 0');

    expect(resultPage[1]).toBeUndefined();
    expect(resultLimit[1]).toBeUndefined();
    
   })
});
