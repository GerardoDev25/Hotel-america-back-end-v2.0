import { CafeteriaDatasource } from '@domain/datasources';
import { Uuid } from '@src/adapters';
import { UpdateCafeteriaDto } from '@domain/dtos/cafeteria';
import { CafeteriaRepositoryImpl } from '.';

describe('cafeteria.repository.impl.ts', () => {
  const cafeteriaDatasource: CafeteriaDatasource = {
    getAll: jest.fn(),
    update: jest.fn(),
  };

  const repository = new CafeteriaRepositoryImpl(cafeteriaDatasource);

  test('should call getAll', async () => {
    await repository.getAll();

    expect(cafeteriaDatasource.getAll).toHaveBeenCalled();
    expect(cafeteriaDatasource.getAll).toHaveBeenCalledWith();
  });

  test('should call (update)', async () => {
    const updateCafeteria: UpdateCafeteriaDto = {
      id: Uuid.v4(),
      isServed: true,
    };

    await repository.update(updateCafeteria);

    expect(cafeteriaDatasource.update).toHaveBeenCalled();
    expect(cafeteriaDatasource.update).toHaveBeenCalledWith(updateCafeteria);
  });
});
