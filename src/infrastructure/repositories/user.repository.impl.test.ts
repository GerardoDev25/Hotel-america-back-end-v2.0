import { Uuid } from '../../adapters';
import { UserDatasource } from '../../domain/datasources';
import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { UserEntity } from '../../domain/entities';
import { IUser } from '../../domain/interfaces';
import {
  generateRandomDate,
  generateRandomName,
  generateRandomPassword,
  generateRandomPhone,
  generateRandomUsername,
} from '../../utils/generator';
import { UserRepositoryImpl } from './user.repository.impl';

describe('user.repository.impl.ts', () => {
  const page = 2;
  const limit = 10;
  const isActive = true;

  const createUser: CreateUserDto = {
    birdDate: new Date(generateRandomDate()),
    name: generateRandomName(),
    password: generateRandomPassword(),
    phone: generateRandomPhone(),
    role: 'admin',
    username: generateRandomUsername(),
    isActive: true,
  };

  const updateUser: UpdateUserDto = {
    id: Uuid.v4(),
    birdDate: new Date(generateRandomDate()),
    name: generateRandomName(),
    password: generateRandomPassword(),
    phone: generateRandomPhone(),
    role: 'cafe',
    username: generateRandomUsername(),
    isActive: true,
  };

  const mockUser: UserEntity = new UserEntity({
    id: Uuid.v4(),
    birdDate: generateRandomDate(),
    name: generateRandomName(),
    password: generateRandomPassword(),
    phone: generateRandomPhone(),
    role: 'reception',
    username: generateRandomUsername(),
    isActive: false,
  });
  const mockUser2: UserEntity = new UserEntity({
    id: Uuid.v4(),
    birdDate: generateRandomDate(),
    name: generateRandomName(),
    password: generateRandomPassword(),
    phone: generateRandomPhone(),
    role: 'laundry',
    username: generateRandomUsername(),
    isActive: false,
  });

  const getAllReturnValue = {
    users: [mockUser, mockUser2],
    limit,
    next: '',
    page,
    prev: '',
    total: 0,
  };
  const mockDatasource: UserDatasource = {
    getByParam: jest.fn().mockResolvedValue(mockUser2),
    getById: jest.fn().mockResolvedValue(mockUser),
    getAll: jest.fn().mockResolvedValue(getAllReturnValue),
    getAllActive: jest.fn().mockResolvedValue(getAllReturnValue),
    create: jest.fn().mockResolvedValue(mockUser2),
    update: jest.fn().mockResolvedValue(mockUser2),
    delete: jest.fn().mockResolvedValue(mockUser2),
  };
  const repository = new UserRepositoryImpl(mockDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getById', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(mockDatasource.getById).toHaveBeenCalled();
    expect(mockDatasource.getById).toHaveBeenCalledWith(id);
  });

  test('should call getByParam', async () => {
    const username = generateRandomUsername();
    await repository.getByParam({ username });

    expect(mockDatasource.getByParam).toHaveBeenCalledWith({ username });
    expect(mockDatasource.getByParam).toHaveBeenCalled();
  });

  test('should call getAll', async () => {
    const users = await repository.getAll(page, limit);

    expect(mockDatasource.getAll).toHaveBeenCalled();
    expect(mockDatasource.getAll).toHaveBeenCalledWith(page, limit);

    expect(users).toEqual(getAllReturnValue);
  });

  test('should call getAllAvailable', async () => {
    const usersAvailable = await repository.getAll(page, limit, isActive);

    expect(mockDatasource.getAllActive).toHaveBeenCalled();
    expect(mockDatasource.getAllActive).toHaveBeenCalledWith(
      page,
      limit,
      isActive
    );
    expect(usersAvailable).toEqual(getAllReturnValue);
  });

  test('should call getById', async () => {
    const id = Uuid.v4();
    const user = await repository.getById(id);
    expect(mockDatasource.getById).toHaveBeenCalledWith(id);
    expect(user).toEqual(mockUser);
  });

  test('should call create with parameter', async () => {
    const user = await repository.create(createUser);

    expect(mockDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockDatasource.create).toHaveBeenCalledWith(createUser);
    expect(user).toEqual(mockUser2);
  });

  test('should call update with parameter', async () => {
    const user = await repository.update(updateUser);
    expect(mockDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockDatasource.update).toHaveBeenCalledWith(updateUser);
    expect(user).toEqual(mockUser2);
  });

  test('should call delete', async () => {
    const id = Uuid.v4();
    const user = await repository.delete(id);
    expect(mockDatasource.delete).toHaveBeenCalledWith(id);
    expect(user).toEqual(mockUser2);
  });
});
