import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';
import { PaymentPagination, IPayment } from '@domain/interfaces';
import { CreatePaymentDto, UpdatePaymentDto } from '@domain/dtos';
import { PaymentController } from '.';

describe('payment.controller.ts', () => {
  const mockPayment: IPayment = {
    id: Uuid.v4(),
    amount: 10,
    paidAt: Generator.randomDate(),
    type: 'credit_cart',
    registerId: Uuid.v4(),
  };

  const pagination: PaymentPagination = {
    payments: [mockPayment],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  it('should return all payments (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 } } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error if not well paginated (getAll)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getAll: jest.fn() } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.getAll(req, res);

    expect(mockService.getAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return all payment (getByParams)', async () => {
    const body = { type: 'bank' };
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 }, body } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.getByParams(req, res);

    expect(mockService.getByParams).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error if not well paginated (getByParams)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getByParams: jest.fn() } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.getByParams(req, res);

    expect(mockService.getByParams).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return a register by id (getById)', async () => {
    const id = mockPayment.id;
    const req = { params: { id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(mockPayment),
    } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(mockPayment);
  });

  it('should create a payment (create)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...body } = mockPayment;

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      create: jest.fn().mockResolvedValue(mockPayment),
    } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.create(req, res);

    expect(res.json).toHaveBeenCalledWith(mockPayment);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.any(CreatePaymentDto)
    );
  });

  it('should throw error if not well create (create)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { create: jest.fn() } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.create(req, res);

    expect(mockService.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: expect.any(Array),
    });
  });

  it('should update a payment (update)', async () => {
    const req = { body: { id: mockPayment.id } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      update: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.update(req, res);

    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
    expect(mockService.update).toHaveBeenCalledWith(
      expect.any(UpdatePaymentDto)
    );
  });

  it('should throw error if not valid object (update)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { update: jest.fn() } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.update(req, res);

    expect(mockService.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['id property is required'],
      ok: false,
    });
  });

  it('should call delete function service (delete)', async () => {
    const req = { params: { id: mockPayment.id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      delete: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const paymentController = new PaymentController(mockService);

    await paymentController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(mockPayment.id);
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
  });
});
