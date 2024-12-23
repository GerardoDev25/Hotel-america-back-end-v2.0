import { Uuid } from '@src/adapters';
import {
  CreateChargeDto,
  FilterChargeDto,
  UpdateChargeDto,
} from '@domain/dtos';
import { ChargeDatasource } from '@domain/datasources';
import { ChargeService } from '.';

describe('charge.service.ts', () => {
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

  const service = new ChargeService(chargeDatasource);

  it('should call (getById)', async () => {
    const id = Uuid.v4();
    await service.getById(id);

    expect(chargeDatasource.getById).toHaveBeenCalledWith(id);
    expect(chargeDatasource.getById).toHaveBeenCalled();
  });

  it('should call (getByParams)', async () => {
    const params: FilterChargeDto = { amount: 12, description: '' };
    await service.getByParams({ page, limit }, params);

    expect(chargeDatasource.getByParams).toHaveBeenCalled();
    expect(chargeDatasource.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      params
    );
  });

  it('should call getAll', async () => {
    await service.getAll({ page, limit });

    expect(chargeDatasource.getAll).toHaveBeenCalled();
    expect(chargeDatasource.getAll).toHaveBeenCalledWith(page, limit);
  });

  it('should call create', async () => {
    const createCharge: CreateChargeDto = {
      amount: 12,
      type: 'cafeteria',
      registerId: Uuid.v4(),
    };

    await service.create(createCharge);

    expect(chargeDatasource.create).toHaveBeenCalled();
    expect(chargeDatasource.create).toHaveBeenCalledWith(createCharge);
  });

  it('should call (update)', async () => {
    const updateCharge: UpdateChargeDto = { id: Uuid.v4() };

    await service.update(updateCharge);

    expect(chargeDatasource.update).toHaveBeenCalled();
    expect(chargeDatasource.update).toHaveBeenCalledWith(updateCharge);
  });

  it('should call (delete)', async () => {
    const id = Uuid.v4();
    await service.delete(id);

    expect(chargeDatasource.delete).toHaveBeenCalled();
    expect(chargeDatasource.delete).toHaveBeenCalledWith(id);
  });
});
