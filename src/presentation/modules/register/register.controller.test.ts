import { Uuid } from '@src/adapters';
import { RegisterEntity } from '@domain/entities';
import { RegisterPagination } from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { RegisterController } from './';
import { CreateRegisterDto } from '@src/domain/dtos/register';

describe('register.controller.ts', () => {
  const registerEntity: RegisterEntity = {
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
    guestsNumber: 1,
    discount: 0,
    price: 0,
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
  };

  const pagination: RegisterPagination = {
    registers: [registerEntity],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  test('should return all register (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 } } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;

    const registerController = new RegisterController(mockService);
    await registerController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  test('should throw error if not well paginated (getAll)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getAll: jest.fn() } as any;

    const registerController = new RegisterController(mockService);
    await registerController.getAll(req, res);

    expect(mockService.getAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  test('should return a register by id (getById)', async () => {
    const id = registerEntity.id;
    const req = { params: { id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(registerEntity),
    } as any;

    const registerController = new RegisterController(mockService);
    await registerController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(registerEntity);
  });

  test('should create a register', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...body } = registerEntity;

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      create: jest.fn().mockResolvedValue(registerEntity),
    } as any;

    const registerController = new RegisterController(mockService);
    await registerController.create(req, res);

    expect(res.json).toHaveBeenCalledWith(registerEntity);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.any(CreateRegisterDto)
    );
  });

  // // todo fix this test
  // test.skip('should throw error if not well create (create)', async () => {
  //   const req = { body: {} } as any;
  //   const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

  //   const mockService = { create: jest.fn() } as any;

  //   const registerController = new RegisterController(mockService);
  //   await registerController.create(req, res);

  //   expect(mockService.create).not.toHaveBeenCalled();
  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     ok: false,
  //     errors: expect.any(Array),
  //   });
  // });
});
