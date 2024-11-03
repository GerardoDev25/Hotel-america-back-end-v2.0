/* eslint-disable @typescript-eslint/no-unused-vars */
import { Uuid } from '@src/adapters';
import { UpdateCafeteriaDto } from '@domain/dtos';
import { CafeteriaItem, CafeteriaList } from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { CafeteriaRepository } from '.';

describe('cafeteria.repository.ts', () => {
  const cafe: CafeteriaItem = {
    id: Uuid.v4(),
    createdAt: new Date().toISOString(),
    guestId: Uuid.v4(),
    guestName: Generator.randomName(),
    roomNumber: 0,
    isServed: false,
  };

  const cafeList: CafeteriaList = { ok: true, items: [cafe] };

  class MockCafeteriaRepository extends CafeteriaRepository {
    async getAll(): Promise<CafeteriaList> {
      return cafeList;
    }

    async update(
      updateCafeteriaDto: UpdateCafeteriaDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'Cafeteria updated successfully' };
    }
  }

  const mockCafeteriaRepository = new MockCafeteriaRepository();

  test('should call method (getAll)', async () => {
    const result = await mockCafeteriaRepository.getAll();
    expect(result).toEqual(cafeList);
  });

  test('should call method (update)', async () => {
    const data = { isServed: true, id: Uuid.v4() };
    const result = await mockCafeteriaRepository.update(data);
    expect(result).toMatchObject({
      ok: true,
      message: 'Cafeteria updated successfully',
    });
  });
});
