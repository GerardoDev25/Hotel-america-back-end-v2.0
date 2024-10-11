import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';
import { ChargeEntity } from '@domain/entities';
import { ChargePagination, ChargeTypeList } from '@domain/interfaces';
import { CreateChargeDto, UpdateChargeDto } from '@domain/dtos/charge';
import { ChargeController } from '.';

describe('charge.controller.ts', () => {
  const chargeEntity: ChargeEntity = {
    id: Uuid.v4(),
    amount: 10,
    createdAt: Generator.randomDate(),
    type: ChargeTypeList.LAUNDRY,
    registerId: Uuid.v4(),
  };

  const pagination: ChargePagination = {
    charges: [chargeEntity],
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

  it('should return a register by id (getById)', async () => {
    const id = chargeEntity.id;
    const req = { params: { id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(chargeEntity),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(chargeEntity);
  });

  it('should create a payment (create)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...body } = chargeEntity;

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      create: jest.fn().mockResolvedValue(chargeEntity),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.create(req, res);

    expect(res.json).toHaveBeenCalledWith(chargeEntity);
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

  it('should update a payment (update)', async () => {
    const req = { body: { id: chargeEntity.id } } as any;
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
    const req = { params: { id: chargeEntity.id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      delete: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const chargeController = new ChargeController(mockService);

    await chargeController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(chargeEntity.id);
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
  });
});
