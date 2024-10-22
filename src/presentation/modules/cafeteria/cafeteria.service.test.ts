import { CafeteriaRepository } from '@src/domain/repositories';
import { CafeteriaService } from '.';
import { UpdateCafeteriaDto } from '@src/domain/dtos/cafeteria';
import { Uuid } from '@src/adapters';

describe('cafeteria.service.ts', () => {
  const chargeRepository: CafeteriaRepository = {
    getAll: jest.fn(),
    update: jest.fn(),
  };

  const cafeteriaService = new CafeteriaService(chargeRepository);

  test('should call (getAll)', async () => {
    await cafeteriaService.getAll();

    expect(chargeRepository.getAll).toHaveBeenCalled();
  });

  test('should call (update)', async () => {
    const cafeteriaDto: UpdateCafeteriaDto = {
      id: Uuid.v4(),
      isServed: true,
    };

    await cafeteriaService.update(cafeteriaDto);

    expect(chargeRepository.update).toHaveBeenCalledWith(cafeteriaDto);
  });
});
