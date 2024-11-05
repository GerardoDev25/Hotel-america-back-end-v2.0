import { Uuid } from '@src/adapters';
import { UpdateCafeteriaDto } from '@domain/dtos';
import { CafeteriaDatasource } from '@domain/datasources';
import { CafeteriaService } from '.';

describe('cafeteria.service.ts', () => {
  const chargeDatasource: CafeteriaDatasource = {
    getAll: jest.fn(),
    update: jest.fn(),
  };

  const cafeteriaService = new CafeteriaService(chargeDatasource);

  test('should call (getAll)', async () => {
    await cafeteriaService.getAll();

    expect(chargeDatasource.getAll).toHaveBeenCalled();
  });

  test('should call (update)', async () => {
    const cafeteriaDto: UpdateCafeteriaDto = {
      id: Uuid.v4(),
      isServed: true,
    };

    await cafeteriaService.update(cafeteriaDto);

    expect(chargeDatasource.update).toHaveBeenCalledWith(cafeteriaDto);
  });
});
