import { UpdateCafeteriaDto } from './update-cafeteria.dto';

describe('update-cafeteria.dto.ts', () => {
  it('should create and instance of UpdateCafeteriaDto', () => {
    const data = { isServed: 'false' };

    const [error, updateDto] = UpdateCafeteriaDto.create(data);

    expect(error).toBeUndefined();
    expect(updateDto).toBeInstanceOf(UpdateCafeteriaDto);
  });

  it('should get error if isServed is not valid', () => {
    const data = { isServed: 'as' };

    const [error, updateDto] = UpdateCafeteriaDto.create(data);

    expect(error).toBe('isServed property most be a boolean');
    expect(updateDto).toBeUndefined();
  });
});
