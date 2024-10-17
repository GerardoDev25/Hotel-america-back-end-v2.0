import { ChargeDatasource } from '@domain/datasources';
import { Uuid } from '@src/adapters';
import {
  CreateChargeDto,
  UpdateChargeDto,
  FilterChargeDto,
} from '@domain/dtos/charge';
import { ChargeRepositoryImpl } from '.';

describe('charge.repository.impl.ts', () => {
  const page = 2;
  const limit = 10;

  const chargeDatasource: ChargeDatasource = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParams: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const repository = new ChargeRepositoryImpl(chargeDatasource);

  test('should call (getById)', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(chargeDatasource.getById).toHaveBeenCalledWith(id);
    expect(chargeDatasource.getById).toHaveBeenCalled();
  });

  test('should call (getByParams)', async () => {
    const params: FilterChargeDto = { amount: 12 };
    await repository.getByParams(page, limit, params);

    expect(chargeDatasource.getByParams).toHaveBeenCalled();
    expect(chargeDatasource.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      params
    );
  });

  test('should call getAll', async () => {
    await repository.getAll(page, limit);

    expect(chargeDatasource.getAll).toHaveBeenCalled();
    expect(chargeDatasource.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call create', async () => {
    const createCharge: CreateChargeDto = {
      amount: 12,
      type: 'laundry',
      registerId: Uuid.v4(),
    };

    await repository.create(createCharge);

    expect(chargeDatasource.create).toHaveBeenCalled();
    expect(chargeDatasource.create).toHaveBeenCalledWith(createCharge);
  });

  test('should call (update)', async () => {
    const updateCharge: UpdateChargeDto = { id: Uuid.v4() };

    await repository.update(updateCharge);

    expect(chargeDatasource.update).toHaveBeenCalled();
    expect(chargeDatasource.update).toHaveBeenCalledWith(updateCharge);
  });

  test('should call (delete)', async () => {
    const id = Uuid.v4();
    await repository.delete(id);

    expect(chargeDatasource.delete).toHaveBeenCalled();
    expect(chargeDatasource.delete).toHaveBeenCalledWith(id);
  });
});
