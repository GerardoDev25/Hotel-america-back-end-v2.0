/* eslint-disable @typescript-eslint/no-unused-vars */
import { Uuid } from '@src/adapters';
import { UpdateCafeteriaDto } from '../dtos/cafeteria';
import { CafeteriaItem, CafeteriaList } from '../interfaces';
import { CafeteriaDatasource } from './cafeteria.datasource';
import { Generator } from '@src/utils/generator';

describe('cafeteria.datasource.ts', () => {
  const cafe: CafeteriaItem = {
    id: Uuid.v4(),
    createdAt: new Date().toISOString(),
    guestId: Uuid.v4(),
    guestName: Generator.randomName(),
    roomNumber: 0,
    isServed: false,
  };

  const cafeList: CafeteriaList = { ok: true, items: [cafe] };

  class MockCafeteriaDatabase extends CafeteriaDatasource {
    async getAll(): Promise<CafeteriaList> {
      return cafeList;
    }

    async update(
      updateCafeteriaDto: UpdateCafeteriaDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'Cafeteria updated successfully' };
    }
  }

  const mockCafeteriaDatabase = new MockCafeteriaDatabase();

  test('should call method (getAll)', async () => {
    const result = await mockCafeteriaDatabase.getAll();
    expect(result).toEqual(cafeList);
  });

  test('should call method (update)', async () => {
    const data = { isServed: true, id: Uuid.v4() };
    const result = await mockCafeteriaDatabase.update(data);
    expect(result).toMatchObject({
      ok: true,
      message: 'Cafeteria updated successfully',
    });
  });
});
