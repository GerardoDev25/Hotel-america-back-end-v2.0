import { Uuid } from '@src/adapters';
import { PaymentRepository } from '@domain/repositories';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDto,
} from '@domain/dtos';
import { PaymentService } from './';

describe('payment.service.ts', () => {
  const page = 2;
  const limit = 10;
  const paymentRepository: PaymentRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParams: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const service = new PaymentService(paymentRepository);

  test('should call (getById)', async () => {
    const id = Uuid.v4();
    await service.getById(id);

    expect(paymentRepository.getById).toHaveBeenCalledWith(id);
    expect(paymentRepository.getById).toHaveBeenCalled();
  });

  it('should call (getByParams)', async () => {
    const params: FilterPaymentDto = { amount: 12, description: '' };
    await service.getByParams({ page, limit }, params);

    expect(paymentRepository.getByParams).toHaveBeenCalled();
    expect(paymentRepository.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      params
    );
  });

  test('should call getAll', async () => {
    await service.getAll({ page, limit });

    expect(paymentRepository.getAll).toHaveBeenCalled();
    expect(paymentRepository.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call create', async () => {
    const createPayment: CreatePaymentDto = {
      amount: 12,
      type: 'cash',
      registerId: Uuid.v4(),
    };

    await service.create(createPayment);

    expect(paymentRepository.create).toHaveBeenCalled();
    expect(paymentRepository.create).toHaveBeenCalledWith(createPayment);
  });

  test('should call (update)', async () => {
    const updatePayment: UpdatePaymentDto = { id: Uuid.v4() };

    await service.update(updatePayment);

    expect(paymentRepository.update).toHaveBeenCalled();
    expect(paymentRepository.update).toHaveBeenCalledWith(updatePayment);
  });

  test('should call (delete)', async () => {
    const id = Uuid.v4();
    await service.delete(id);

    expect(paymentRepository.delete).toHaveBeenCalled();
    expect(paymentRepository.delete).toHaveBeenCalledWith(id);
  });
});
