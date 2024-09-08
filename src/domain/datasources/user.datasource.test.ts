import { Uuid } from '../../adapters';
import {
  generateRandomDate,
  generateRandomName,
  generateRandomPassword,
  generateRandomPhone,
  generateRandomUsername,
} from '../../utils/generator';
import { CreateUserDto, UpdateUserDto } from '../dtos/user';
import { UserEntity } from '../entities';
import { UserPagination } from '../interfaces';
import { UserDatasource } from './user.datasource';

describe('user.database.ts', () => {
  const page = 2;
  const limit = 10;
  const isActive = true;

  const mockUser: UserEntity = new UserEntity({
    id: Uuid.v4(),
    birdDate: generateRandomDate(),
    name: generateRandomName(),
    password: generateRandomPassword(),
    phone: generateRandomPhone(),
    role: 'admin',
    username: generateRandomUsername(),
    isActive: true,
  });
  const mockUser2: UserEntity = new UserEntity({
    id: Uuid.v4(),
    birdDate: generateRandomDate(),
    name: generateRandomName(),
    password: generateRandomPassword(),
    phone: generateRandomPhone(),
    role: 'cafe',
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

  class MockUserDataSource implements UserDatasource {
    async getAllActive(
      page: number,
      limit: number,
      isActive: boolean
    ): Promise<UserPagination> {
      return getAllReturnValue;
    }

    async getAll(page: number, limit: number): Promise<UserPagination> {
      return getAllReturnValue;
    }

    async create(
      createUserDto: CreateUserDto
    ): Promise<{ ok: boolean; user: UserEntity }> {
      return { ok: true, user: mockUser2 };
    }

    async getById(id: string): Promise<{ ok: boolean; user: UserEntity }> {
      return { ok: true, user: mockUser };
    }

    async update(
      updateUserDto: UpdateUserDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }
  }

  test('test in function getAll()', async () => {
    const mockUserDataSource = new MockUserDataSource();

    expect(typeof mockUserDataSource.getAll).toBe('function');
    expect(mockUserDataSource.getAll(page, limit)).resolves.toEqual(
      getAllReturnValue
    );

    const { users } = await mockUserDataSource.getAll(page, limit);

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(2);
    users.forEach((user) => {
      expect(user).toBeInstanceOf(UserEntity);
    });
  });

  test('test in function getAllActive()', async () => {
    const mockUserDataSource = new MockUserDataSource();

    expect(typeof mockUserDataSource.getAllActive).toBe('function');
    expect(
      mockUserDataSource.getAllActive(page, limit, isActive)
    ).resolves.toEqual(getAllReturnValue);

    const { users } = await mockUserDataSource.getAllActive(
      page,
      limit,
      isActive
    );

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(2);
    users.forEach((user) => {
      expect(user).toBeInstanceOf(UserEntity);
    });
  });

  test('test in function create()', async () => {
    const mockUserDataSource = new MockUserDataSource();
    const { id, ...rest } = mockUser;
    const createUser = {
      ...rest,
      birdDate: new Date(rest.birdDate),
    };

    const { ok, user } = await mockUserDataSource.create(createUser);

    expect(ok).toBeTruthy();
    expect(user).toBeInstanceOf(UserEntity);
    expect(typeof mockUserDataSource.create).toBe('function');
    expect(mockUserDataSource.create(createUser)).resolves.toEqual({
      ok: true,
      user: expect.any(UserEntity),
    });
  });

  test('test in function update()', async () => {
    const mockUserDataSource = new MockUserDataSource();
    const { birdDate, ...rest } = mockUser;

    const { ok, message } = await mockUserDataSource.update(rest);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockUserDataSource.update).toBe('function');
    expect(mockUserDataSource.update(rest)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  test('test in function delete()', async () => {
    const id = Uuid.v4();
    const mockUserDataSource = new MockUserDataSource();
    const { ok, message } = await mockUserDataSource.delete(id);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockUserDataSource.delete).toBe('function');
    expect(mockUserDataSource.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
