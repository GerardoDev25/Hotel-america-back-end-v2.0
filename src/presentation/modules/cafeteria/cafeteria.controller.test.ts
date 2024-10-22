import { CafeteriaList } from '@src/domain/interfaces';
import { CafeteriaController } from '.';
import { Uuid } from '@src/adapters';
import { UpdateCafeteriaDto } from '@src/domain/dtos/cafeteria';

const records: CafeteriaList = {
  ok: true,
  items: [],
};

describe('cafeteria.controller.ts', () => {
  it('should return all cafeteria (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = {} as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(records),
    } as any;
    const chargeController = new CafeteriaController(mockService);

    await chargeController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(records);
  });

  it('should update a cafeteria (update)', async () => {
    const body = { id: Uuid.v4(), isServed: true };
    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      update: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;

    const cafeteriaController = new CafeteriaController(mockService);

    await cafeteriaController.update(req, res);

    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
    expect(mockService.update).toHaveBeenCalledWith(
      expect.any(UpdateCafeteriaDto)
    );
  });

  it('should get error with invalid object (update)', async () => {
    const body = { id: 'Uuid.v4()', isServed: 12 };
    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { update: jest.fn() } as any;

    const cafeteriaController = new CafeteriaController(mockService);

    await cafeteriaController.update(req, res);

    expect(mockService.update).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['id is not a valid uuid', 'isServed property most be a boolean'],
    });
  });

  it('should have params as required (update)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { update: jest.fn() } as any;

    const cafeteriaController = new CafeteriaController(mockService);

    await cafeteriaController.update(req, res);

    expect(mockService.update).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['id property is required', 'isServed property is required'],
    });
  });
});
