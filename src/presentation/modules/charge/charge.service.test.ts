import { Uuid } from '@src/adapters';
import { ChargeRepository } from '@domain/repositories';
import {
  CreateChargeDto,
  FilterChargeDto,
  UpdateChargeDto,
} from '@domain/dtos/charge';
import { ChargeService } from '.';

describe('charge.service.ts', () => {
  const page = 2;
  const limit = 10;

  const chargeRepository: ChargeRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParams: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const service = new ChargeService(chargeRepository);

  test('should call (getById)', async () => {
    const id = Uuid.v4();
    await service.getById(id);

    expect(chargeRepository.getById).toHaveBeenCalledWith(id);
    expect(chargeRepository.getById).toHaveBeenCalled();
  });

  test('should call (getByParams)', async () => {
    const params: FilterChargeDto = { amount: 12, description: '' };
    await service.getByParams({ page, limit }, params);

    expect(chargeRepository.getByParams).toHaveBeenCalled();
    expect(chargeRepository.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      params
    );
  });

  test('should call getAll', async () => {
    await service.getAll({ page, limit });

    expect(chargeRepository.getAll).toHaveBeenCalled();
    expect(chargeRepository.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call create', async () => {
    const createCharge: CreateChargeDto = {
      amount: 12,
      type: 'cafeteria',
      registerId: Uuid.v4(),
    };

    await service.create(createCharge);

    expect(chargeRepository.create).toHaveBeenCalled();
    expect(chargeRepository.create).toHaveBeenCalledWith(createCharge);
  });

  test('should call (update)', async () => {
    const updateCharge: UpdateChargeDto = { id: Uuid.v4() };

    await service.update(updateCharge);

    expect(chargeRepository.update).toHaveBeenCalled();
    expect(chargeRepository.update).toHaveBeenCalledWith(updateCharge);
  });

  test('should call (delete)', async () => {
    const id = Uuid.v4();
    await service.delete(id);

    expect(chargeRepository.delete).toHaveBeenCalled();
    expect(chargeRepository.delete).toHaveBeenCalledWith(id);
  });
});
