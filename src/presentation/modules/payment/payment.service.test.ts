import { Uuid } from '@src/adapters';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDto,
} from '@domain/dtos';
import { PaymentDatasource } from '@domain/datasources';
import { PaymentService } from './';

describe('payment.service.ts', () => {
  const page = 2;
  const limit = 10;
  const paymentDatasource: PaymentDatasource = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParams: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const service = new PaymentService(paymentDatasource);

  test('should call (getById)', async () => {
    const id = Uuid.v4();
    await service.getById(id);

    expect(paymentDatasource.getById).toHaveBeenCalledWith(id);
    expect(paymentDatasource.getById).toHaveBeenCalled();
  });

  it('should call (getByParams)', async () => {
    const params: FilterPaymentDto = { amount: 12, description: '' };
    await service.getByParams({ page, limit }, params);

    expect(paymentDatasource.getByParams).toHaveBeenCalled();
    expect(paymentDatasource.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      params
    );
  });

  test('should call getAll', async () => {
    await service.getAll({ page, limit });

    expect(paymentDatasource.getAll).toHaveBeenCalled();
    expect(paymentDatasource.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call create', async () => {
    const createPayment: CreatePaymentDto = {
      amount: 12,
      type: 'cash',
      registerId: Uuid.v4(),
    };

    await service.create(createPayment);

    expect(paymentDatasource.create).toHaveBeenCalled();
    expect(paymentDatasource.create).toHaveBeenCalledWith(createPayment);
  });

  test('should call (update)', async () => {
    const updatePayment: UpdatePaymentDto = { id: Uuid.v4() };

    await service.update(updatePayment);

    expect(paymentDatasource.update).toHaveBeenCalled();
    expect(paymentDatasource.update).toHaveBeenCalledWith(updatePayment);
  });

  test('should call (delete)', async () => {
    const id = Uuid.v4();
    await service.delete(id);

    expect(paymentDatasource.delete).toHaveBeenCalled();
    expect(paymentDatasource.delete).toHaveBeenCalledWith(id);
  });
});
