import { CreateUserDto, UpdateUserDto } from '@domain/dtos';
import { UserDatasource } from '@domain/datasources';
import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';
import { UserRepositoryImpl } from '.';

describe('user.repository.impl.ts', () => {
  const page = 2;
  const limit = 10;
  const isActive = true;

  const mockDatasource: UserDatasource = {
    getByParams: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    getAllActive: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const repository = new UserRepositoryImpl(mockDatasource);

  beforeEach(() => jest.clearAllMocks());

  test('should call getById', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(mockDatasource.getById).toHaveBeenCalledTimes(1);
    expect(mockDatasource.getById).toHaveBeenCalledWith(id);
  });

  test('should call getByParams', async () => {
    const username = Generator.randomUsername();
    await repository.getByParams(page, limit, { username });

    expect(mockDatasource.getByParams).toHaveBeenCalledTimes(1);
    expect(mockDatasource.getByParams).toHaveBeenCalledWith(page, limit, {
      username,
    });
  });

  test('should call getAll', async () => {
    await repository.getAll(page, limit);

    expect(mockDatasource.getAll).toHaveBeenCalledTimes(1);
    expect(mockDatasource.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call getAllAvailable', async () => {
    await repository.getAll(page, limit, isActive);

    expect(mockDatasource.getAllActive).toHaveBeenCalledTimes(1);
    expect(mockDatasource.getAllActive).toHaveBeenCalledWith(
      page,
      limit,
      isActive
    );
  });

  test('should call create with parameter', async () => {
    const createUser: CreateUserDto = {
      birdDate: new Date(Generator.randomDate()),
      name: Generator.randomName(),
      password: Generator.randomPassword(),
      phone: Generator.randomPhone(),
      role: 'admin',
      username: Generator.randomUsername(),
      isActive: true,
    };

    await repository.create(createUser);

    expect(mockDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockDatasource.create).toHaveBeenCalledWith(createUser);
  });

  test('should call update with parameter', async () => {
    const updateUser: UpdateUserDto = {
      id: Uuid.v4(),
      birdDate: new Date(Generator.randomDate()),
      name: Generator.randomName(),
      password: Generator.randomPassword(),
      phone: Generator.randomPhone(),
      role: 'cafe',
      username: Generator.randomUsername(),
      isActive: true,
    };

    await repository.update(updateUser);

    expect(mockDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockDatasource.update).toHaveBeenCalledWith(updateUser);
  });

  test('should call delete', async () => {
    const id = Uuid.v4();

    await repository.delete(id);

    expect(mockDatasource.delete).toHaveBeenCalledTimes(1);
    expect(mockDatasource.delete).toHaveBeenCalledWith(id);
  });
});
