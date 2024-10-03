import { PaymentDatasource } from '@src/domain/datasources';
import { PaymentRepositoryImpl } from './payment.repository.impl';
import { Uuid } from '@src/adapters';
import { CreatePaymentDto, UpdatePaymentDto } from '@src/domain/dtos/payment';

describe('payment.repository.impl.ts', () => {
  const paymentDatasource: PaymentDatasource = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParam: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const repository = new PaymentRepositoryImpl(paymentDatasource);

  test('should call (getById)', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(paymentDatasource.getById).toHaveBeenCalledWith(id);
    expect(paymentDatasource.getById).toHaveBeenCalled();
  });

  test('should call (getByParam)', async () => {
    const amount = 12;
    await repository.getByParam({ amount });

    expect(paymentDatasource.getByParam).toHaveBeenCalled();
    expect(paymentDatasource.getByParam).toHaveBeenCalledWith({ amount });
  });

  test('should call getAll', async () => {
    const page = 2;
    const limit = 10;

    await repository.getAll(page, limit);

    expect(paymentDatasource.getAll).toHaveBeenCalled();
    expect(paymentDatasource.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call create', async () => {
    const createPayment: CreatePaymentDto = {
      amount: 12,
      type: 'cash',
      registerId: Uuid.v4(),
    };

    await repository.create(createPayment);

    expect(paymentDatasource.create).toHaveBeenCalled();
    expect(paymentDatasource.create).toHaveBeenCalledWith(createPayment);
  });

  test('should call (update)', async () => {
    const updatePayment: UpdatePaymentDto = { id: Uuid.v4() };

    await repository.update(updatePayment);

    expect(paymentDatasource.update).toHaveBeenCalled();
    expect(paymentDatasource.update).toHaveBeenCalledWith(updatePayment);
  });

  test('should call (delete)', async () => {
    const id = Uuid.v4();
    await repository.delete(id);

    expect(paymentDatasource.delete).toHaveBeenCalled();
    expect(paymentDatasource.delete).toHaveBeenCalledWith(id);
  });
});
