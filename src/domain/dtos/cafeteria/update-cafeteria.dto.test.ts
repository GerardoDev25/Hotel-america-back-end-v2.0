import { Uuid } from '@src/adapters';
import { UpdateCafeteriaDto } from './update-cafeteria.dto';

describe('update-cafeteria.dto.ts', () => {
  it('should create and instance of UpdateCafeteriaDto', () => {
    const data = { id: Uuid.v4(), isServed: 'false' };

    const [error, updateDto] = UpdateCafeteriaDto.create(data);

    expect(error).toBeUndefined();
    expect(updateDto).toBeInstanceOf(UpdateCafeteriaDto);
  });

  it('should get params as required', () => {
    const data = {};

    const [error, updateDto] = UpdateCafeteriaDto.create(data);

    expect(updateDto).toBeUndefined();
    expect(error).toEqual([
      'id property is required',
      'isServed property is required',
    ]);
  });

  it('should get error if isServed is not valid', () => {
    const data = { id: Uuid.v4(), isServed: 'as' };

    const [error, updateDto] = UpdateCafeteriaDto.create(data);

    expect(error).toEqual(['isServed property most be a boolean']);
    expect(updateDto).toBeUndefined();
  });
});
