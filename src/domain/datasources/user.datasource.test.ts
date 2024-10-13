/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateUserDto, UpdateUserDto } from '@domain/dtos/user';
import { UserFilter, UserPagination } from '@domain/interfaces';
import { UserEntity } from '@domain/entities';
import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';
import { UserDatasource } from '.';

describe('user.database.ts', () => {
  const page = 2;
  const limit = 10;
  const isActive = true;

  const mockUser = new UserEntity({
    id: Uuid.v4(),
    birdDate: Generator.randomDate(),
    name: Generator.randomName(),
    password: Generator.randomPassword(),
    phone: Generator.randomPhone(),
    role: 'admin',
    username: Generator.randomUsername(),
    isActive: true,
  });
  const mockUser2 = new UserEntity({
    id: Uuid.v4(),
    birdDate: Generator.randomDate(),
    name: Generator.randomName(),
    password: Generator.randomPassword(),
    phone: Generator.randomPhone(),
    role: 'cafe',
    username: Generator.randomUsername(),
    isActive: false,
  });

  const userPagination = {
    users: [mockUser, mockUser2],
    limit,
    next: '',
    page,
    prev: '',
    total: 0,
  };

  class MockUserDataSource implements UserDatasource {
    async getByParam(
      searchParam: UserFilter
    ): Promise<{ ok: boolean; user: UserEntity | null }> {
      return { ok: true, user: mockUser };
    }

    async getById(id: string): Promise<{ ok: boolean; user: UserEntity }> {
      return { ok: true, user: mockUser };
    }

    async getAll(page: number, limit: number): Promise<UserPagination> {
      return userPagination;
    }

    async getAllActive(
      page: number,
      limit: number,
      isActive: boolean
    ): Promise<UserPagination> {
      return userPagination;
    }

    async create(
      createUserDto: CreateUserDto
    ): Promise<{ ok: boolean; user: UserEntity }> {
      return { ok: true, user: mockUser2 };
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

  const mockUserDataSource = new MockUserDataSource();
  test('test in function getById()', async () => {
    const id = Uuid.v4();

    expect(typeof mockUserDataSource.getById).toBe('function');
    expect(mockUserDataSource.getById(id)).resolves.toEqual({
      ok: true,
      user: mockUser,
    });
  });

  test('test in function getByParam()', async () => {
    const username = Generator.randomUsername();

    expect(typeof mockUserDataSource.getByParam).toBe('function');
    expect(mockUserDataSource.getByParam({ username })).resolves.toEqual({
      ok: true,
      user: mockUser,
    });
  });

  test('test in function getAll()', async () => {
    const { users } = await mockUserDataSource.getAll(page, limit);

    expect(typeof mockUserDataSource.getAll).toBe('function');
    expect(mockUserDataSource.getAll(page, limit)).resolves.toEqual(
      userPagination
    );

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(2);
    users.forEach((user) => {
      expect(user).toBeInstanceOf(UserEntity);
    });
  });

  test('test in function getAllActive()', async () => {
    const { users } = await mockUserDataSource.getAllActive(
      page,
      limit,
      isActive
    );

    expect(typeof mockUserDataSource.getAllActive).toBe('function');
    expect(
      mockUserDataSource.getAllActive(page, limit, isActive)
    ).resolves.toEqual(userPagination);

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(2);
    users.forEach((user) => {
      expect(user).toBeInstanceOf(UserEntity);
    });
  });

  test('test in function create()', async () => {
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
