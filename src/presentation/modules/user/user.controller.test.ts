import { PaginationDto, UpdateUserDto } from '@domain/dtos';
import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';
import { CreateUser, UserFilter, UserPagination } from '@domain/interfaces';
import { UserController, UserService } from '.';

describe('user.controller.ts', () => {
  const user1: CreateUser = {
    birdDate: Generator.randomDate(),
    name: Generator.randomName().toLowerCase(),
    password: Generator.randomPassword(),
    phone: Generator.randomPhone(),
    username: Generator.randomUsername().toLowerCase(),
    role: 'admin',
    isActive: true,
  };

  const data = { ok: true, message: '' };

  const pagination: UserPagination = {
    users: [{ ...user1, id: Uuid.v4() }],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  const mockUserService = {
    getAll: jest.fn().mockResolvedValue(pagination),
    getById: jest.fn().mockResolvedValue(pagination),
    create: jest.fn().mockResolvedValue(user1),
    update: jest.fn().mockResolvedValue(data),
    delete: jest.fn().mockResolvedValue(data),
  } as unknown as UserService;

  it('should return all users when getAll is called (getAll)', async () => {
    const req = { query: { page: '1', limit: '10', isActive: 'true' } } as any;
    const res = { json: jest.fn() } as any;

    const roomController = new UserController(mockUserService);
    await roomController.getAll(req, res);

    expect(mockUserService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should retrieve all users with default pagination (getAll)', async () => {
    const req = { query: {} } as any;
    const res = { json: jest.fn(), status: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(pagination);
    expect(mockUserService.getAll).toHaveBeenCalledWith(
      expect.any(PaginationDto),
      undefined
    );
  });

  it('should  return error if is not well paginated (getAll)', async () => {
    const req = { query: { page: 'hol' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const userController = new UserController(mockUserService);
    await userController.getAll(req, res);

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
    await userController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['isActive most be true or false'],
      ok: false,
    });
  });

  it('should return users when is called (getByParams)', async () => {
    const body: UserFilter = { name: '' };
    const req = { query: { page: '1', limit: '10', body } } as any;
    const res = { json: jest.fn() } as any;

    const roomController = new UserController(mockUserService);
    await roomController.getAll(req, res);

    expect(mockUserService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error when User ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const roomController = new UserController(mockUserService);
    await roomController.getById(req, res);

    expect(roomController.getById).rejects.toThrow();
    expect(mockUserService.getById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should create a new user when createUser is called (create)', async () => {
    const req = { body: user1 } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.create(req, res);

    expect(mockUserService.create).toHaveBeenCalledWith({
      ...user1,
      birdDate: new Date(user1.birdDate),
    });
  });

  it('should update a user when updateUser is called (update)', async () => {
    const req = { body: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(data);
    expect(mockUserService.update).toHaveBeenCalledWith(
      expect.any(UpdateUserDto)
    );
  });

  it('should delete a user when deleteUser is called (delete)', async () => {
    const req = { params: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const userController = new UserController(mockUserService);
    await userController.delete(req, res);

    expect(res.json).toHaveBeenCalledWith(data);
    expect(mockUserService.delete).toHaveBeenCalledWith(req.params.id);
  });
});
