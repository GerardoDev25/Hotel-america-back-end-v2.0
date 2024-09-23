import { PaginationDto } from '@domain/dtos/share';
import { UpdateUserDto } from '@domain/dtos/user';

import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';

import { UserController, UserService } from '.';

describe('user.controller.ts', () => {
  const user1 = {
    birdDate: Generator.randomDate(),
    name: Generator.randomName(),
    password: Generator.randomPassword(),
    phone: Generator.randomPhone(),
    username: Generator.randomUsername(),
    role: 'admin',
    isActive: true,
  };

  const data = { ok: true, message: '' };

  const mockUserService = {
    getAll: jest.fn().mockResolvedValue([user1]),
    getById: jest.fn().mockResolvedValue(user1),
    create: jest.fn().mockResolvedValue(user1),
    update: jest.fn().mockResolvedValue(data),
    delete: jest.fn().mockResolvedValue(data),
  } as unknown as UserService;

  it('should return all users when getAllUsers is called (getAll)', async () => {
    const req = { query: { page: '1', limit: '10', isActive: 'true' } } as any;
    const res = { json: jest.fn() } as any;

    const roomController = new UserController(mockUserService);
    await roomController.getAllUsers(req, res);

    expect(mockUserService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([user1]);
  });

  it('should retrieve all users with default pagination (getAll)', async () => {
    const req = { query: {} } as any;
    const res = { json: jest.fn(), status: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([user1]);
    expect(mockUserService.getAll).toHaveBeenCalledWith(
      expect.any(PaginationDto),
      undefined
    );
  });

  it('should  return error if is not well paginated (getAll)', async () => {
    const req = { query: { page: 'hol' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const userController = new UserController(mockUserService);
    await userController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['Page and limit must be a number'],
      ok: false,
    });
  });

  it('should return error if isActive param is invalid (getAll)', async () => {
    const req = { query: { isActive: 'hol' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const userController = new UserController(mockUserService);
    await userController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['isActive most be true or false'],
      ok: false,
    });
  });

  it('should throw error when User ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const roomController = new UserController(mockUserService);
    await roomController.getUserById(req, res);

    expect(roomController.getUserById).rejects.toThrow();
    expect(mockUserService.getById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should create a new user when createUser is called (create)', async () => {
    const req = { body: user1 } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.createUser(req, res);

    expect(mockUserService.create).toHaveBeenCalledWith({
      ...user1,
      birdDate: new Date(user1.birdDate),
    });
  });

  it('should update a user when updateUser is called (update)', async () => {
    const req = { body: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.updateUser(req, res);

    expect(res.json).toHaveBeenCalledWith(data);
    expect(mockUserService.update).toHaveBeenCalledWith(
      expect.any(UpdateUserDto)
    );
  });

  it('should delete a user when deleteUser is called (delete)', async () => {
    const req = { params: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith(data);
    expect(mockUserService.delete).toHaveBeenCalledWith(req.params.id);
  });
});
