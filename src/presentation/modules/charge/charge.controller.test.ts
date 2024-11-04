import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';
import { ChargePagination, ICharge } from '@domain/interfaces';
import { CreateChargeDto, UpdateChargeDto } from '@domain/dtos';
import { ChargeController } from '.';

describe('charge.controller.ts', () => {
  const mockCharge: ICharge = {
    id: Uuid.v4(),
    amount: 10,
    createdAt: Generator.randomDate(),
    type: 'laundry',
    registerId: Uuid.v4(),
  };

  const pagination: ChargePagination = {
    charges: [mockCharge],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  it('should return all charges (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 } } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error if not well paginated (getAll)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getAll: jest.fn() } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.getAll(req, res);

    expect(mockService.getAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return all charges (getByParams)', async () => {
    const body = { type: 'laundry' };
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 }, body } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.getByParams(req, res);

    expect(mockService.getByParams).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error if not well paginated (getByParams)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getByParams: jest.fn() } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.getByParams(req, res);

    expect(mockService.getByParams).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return a register by id (getById)', async () => {
    const id = mockCharge.id;
    const req = { params: { id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(mockCharge),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(mockCharge);
  });

  it('should create a charge (create)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...body } = mockCharge;

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      create: jest.fn().mockResolvedValue(mockCharge),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.create(req, res);

    expect(res.json).toHaveBeenCalledWith(mockCharge);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.any(CreateChargeDto)
    );
  });

  it('should throw error if not well create (create)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { create: jest.fn() } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.create(req, res);

    expect(mockService.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: expect.any(Array),
    });
  });

  it('should update a charge (update)', async () => {
    const req = { body: { id: mockCharge.id } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      update: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.update(req, res);

    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
    expect(mockService.update).toHaveBeenCalledWith(
      expect.any(UpdateChargeDto)
    );
  });

  it('should throw error if not valid object (update)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { update: jest.fn() } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.update(req, res);

    expect(mockService.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['id property is required'],
      ok: false,
    });
  });

  it('should call delete function service (delete)', async () => {
    const req = { params: { id: mockCharge.id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      delete: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(mockCharge.id);
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
  });
});
