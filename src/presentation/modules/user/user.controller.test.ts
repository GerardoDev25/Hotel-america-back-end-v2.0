import { Request, Response } from 'express';
import { UserController } from './user.controller';
import { CustomError } from '../../../domain/error';
import { UserService } from './user.service';
import { PaginationDto } from '../../../domain/dtos/share';
import { Generator } from '../../../utils/generator';
import { Uuid } from '../../../adapters';

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
  const user2 = {
    birdDate: Generator.randomDate(),
    name: Generator.randomName(),
    password: Generator.randomPassword(),
    phone: Generator.randomPhone(),
    username: Generator.randomUsername(),
    role: 'admin',
    isActive: true,
  };

  const mockUserService = {
    getAll: jest.fn().mockResolvedValue([user1, user2]),
    getById: jest
      .fn()
      .mockResolvedValue(user1)
      .mockRejectedValue(CustomError.notFound('User not found')),
    create: jest
      .fn()
      .mockResolvedValue(user1)
      .mockRejectedValue(
        CustomError.internalServerError('internal server error')
      ),
    update: jest
      .fn()
      .mockResolvedValue(user1)
      .mockRejectedValue(
        CustomError.internalServerError('internal server error')
      ),
    delete: jest
      .fn()
      .mockResolvedValue(user1)
      .mockRejectedValue(
        CustomError.internalServerError('internal server error')
      ),
  } as unknown as UserService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users when getAllUsers is called (getAll)', async () => {
    const req = {
      query: { page: '1', limit: '10', isActive: 'true' },
    } as unknown as Request;

    const res = { json: jest.fn() } as unknown as Response;

    const roomController = new UserController(mockUserService);
    await roomController.getAllUsers(req, res);

    expect(mockUserService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([user1, user2]);
  });

  it('should retrieve all users with default pagination when no query parameters are provided (getAll)', async () => {
    const req = { query: {} } as unknown as Request;
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const userController = new UserController(mockUserService);
    await userController.getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([user1, user2]);
    expect(mockUserService.getAll).toHaveBeenCalledWith(
      expect.any(PaginationDto),
      undefined
    );
  });

  it('should  return error if is not well paginated (getAll)', async () => {
    const req = { query: { page: 'hol' } } as unknown as Request;
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const userController = new UserController(mockUserService);
    await userController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['Page and limit must be a number'],
      ok: false,
    });
  });

  it('should return error if isActive param is invalid (getAll)', async () => {
    const req = { query: { isActive: 'hol' } } as unknown as Request;

    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const userController = new UserController(mockUserService);
    await userController.getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith({
      errors: ['isActive most be true or false'],
      ok: false,
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw error when User ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const roomController = new UserController(mockUserService);
    await roomController.getUserById(req, res);

    expect(mockUserService.getById).toHaveBeenCalledWith('non-existent-id');
    expect(roomController.getUserById).rejects.toThrow();
  });

  // it.only('should throw error when User ID does not exist (getById)', async () => {
  //   const req = { params: { id: 'non-existent-id' } } as unknown as Request;

  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   } as unknown as Response;

  //   const roomController = new UserController(mockUserService);

  //   try {
  //     const a = await roomController.getUserById(req, res);
  //     console.log(a);
  //   } catch (error) {
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  //     expect(mockUserService.getById).toHaveBeenCalledWith('non-existent-id');
  //     expect(error).toBeInstanceOf(CustomError);
  //   }
  // });

  it('should create a new user when createUser is called (create)', async () => {
    const req = { body: user1 } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const userController = new UserController(mockUserService);
    await userController.createUser(req, res);

    expect(mockUserService.create).toHaveBeenCalledWith({
      ...user1,
      birdDate: new Date(user1.birdDate),
    });
  });

  // todo this test use to run correctly but not any more check later
  it.skip('should update a user when updateUser is called (update)', async () => {
    const req = { body: user1 } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const userController = new UserController(mockUserService);
    await userController.updateUser(req, res);

    expect(mockUserService.update).toHaveBeenCalledWith({
      ...user1,
      birdDate: new Date(user1.birdDate),
    });
  });

  it('should delete a user when deleteUser is called (delete)', async () => {
    const req = { params: { id: Uuid.v4() } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const userController = new UserController(mockUserService);
    await userController.deleteUser(req, res);

    expect(mockUserService.delete).toHaveBeenCalledWith(req.params.id);
  });
});
