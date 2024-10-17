import { Uuid } from '@src/adapters';
import { PaymentDatasource } from '@src/domain/datasources';
import { PaymentRepositoryImpl } from './payment.repository.impl';
import { CreatePaymentDto, UpdatePaymentDto } from '@src/domain/dtos/payment';

describe('payment.repository.impl.ts', () => {
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

  const repository = new PaymentRepositoryImpl(paymentDatasource);

  it('should call (getById)', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(paymentDatasource.getById).toHaveBeenCalledWith(id);
    expect(paymentDatasource.getById).toHaveBeenCalled();
  });

  it('should call (getByParams)', async () => {
    const params = { amount: 12 };
    await repository.getByParams(page, limit, params);

    expect(paymentDatasource.getByParams).toHaveBeenCalled();
    expect(paymentDatasource.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      params
    );
  });

  it('should call getAll', async () => {
    await repository.getAll(page, limit);

    expect(paymentDatasource.getAll).toHaveBeenCalled();
    expect(paymentDatasource.getAll).toHaveBeenCalledWith(page, limit);
  });

  it('should call create', async () => {
    const createPayment: CreatePaymentDto = {
      amount: 12,
      type: 'cash',
      registerId: Uuid.v4(),
    };

    await repository.create(createPayment);

    expect(paymentDatasource.create).toHaveBeenCalled();
    expect(paymentDatasource.create).toHaveBeenCalledWith(createPayment);
  });

  it('should call (update)', async () => {
    const updatePayment: UpdatePaymentDto = { id: Uuid.v4() };

    await repository.update(updatePayment);

    expect(paymentDatasource.update).toHaveBeenCalled();
    expect(paymentDatasource.update).toHaveBeenCalledWith(updatePayment);
  });

  it('should call (delete)', async () => {
    const id = Uuid.v4();
    await repository.delete(id);

    expect(paymentDatasource.delete).toHaveBeenCalled();
    expect(paymentDatasource.delete).toHaveBeenCalledWith(id);
  });
});
