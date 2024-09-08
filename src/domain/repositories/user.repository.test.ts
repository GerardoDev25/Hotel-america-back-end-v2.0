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
import { IUser, UserPagination } from '../interfaces';
import { UserRepository } from './user.repository';
describe('user.repository.ts', () => {
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
    role: 'reception',
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
  class MockUserRepository implements UserRepository {
    async getById(id: string): Promise<{ ok: boolean; user: UserEntity }> {
      return { ok: true, user: mockUser };
    }

    async getByParam(
      searchParam: Partial<Pick<IUser, keyof IUser>>
    ): Promise<{ ok: boolean; user: UserEntity | null }> {
      return { ok: true, user: mockUser };
    }

    async getAll(
      page: number,
      limit: number,
      isActive: boolean
    ): Promise<UserPagination> {
      return getAllReturnValue;
    }

    async create(
      createUserDto: CreateUserDto
    ): Promise<{ ok: boolean; user: UserEntity }> {
      return { ok: true, user: mockUser2 };
    }

    async update(
      updateUserDto: UpdateUserDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'update' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'delete' };
    }
  }

  test('test in function getById()', async () => {
    const id = Uuid.v4();
    const mockUserRepository = new MockUserRepository();

    const { user } = await mockUserRepository.getById(id);

    expect(typeof mockUserRepository.getById).toBe('function');
    expect(mockUserRepository.getById(id)).resolves.toEqual({
      ok: true,
      user: mockUser,
    });

    expect(user).toBeInstanceOf(UserEntity);
  });

  test('test in function getByParam()', async () => {
    const searchParam: Partial<Pick<IUser, keyof IUser>> = { isActive: false };
    const mockUserRepository = new MockUserRepository();

    const { user } = await mockUserRepository.getByParam(searchParam);

    expect(typeof mockUserRepository.getByParam).toBe('function');
    expect(mockUserRepository.getByParam(searchParam)).resolves.toEqual({
      ok: true,
      user: mockUser,
    });

    expect(user).toBeInstanceOf(UserEntity);
  });

  test('test in function getAll()', async () => {
    const mockUserRepository = new MockUserRepository();

    expect(typeof mockUserRepository.getAll).toBe('function');
    const { users } = await mockUserRepository.getAll(page, limit, isActive);

    expect(mockUserRepository.getAll(page, limit, isActive)).resolves.toEqual(
      getAllReturnValue
    );

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(2);
    users.forEach((user) => {
      expect(user).toBeInstanceOf(UserEntity);
    });
  });

  test('test in function create()', async () => {
    const mockUserRepository = new MockUserRepository();

    const { id, ...rest } = mockUser;
    const createUser = {
      ...rest,
      birdDate: new Date(rest.birdDate),
    };
    const { ok, user } = await mockUserRepository.create(createUser);

    expect(ok).toBeTruthy();
    expect(user).toBeInstanceOf(UserEntity);
    expect(typeof mockUserRepository.create).toBe('function');
    expect(mockUserRepository.create(createUser)).resolves.toEqual({
      ok: true,
      user: mockUser2,
    });
  });

  test('test in function update()', async () => {
    const mockUserRepository = new MockUserRepository();
    const updateUser = {
      ...mockUser,
      birdDate: new Date(mockUser.birdDate),
    };
    const { ok, message } = await mockUserRepository.update(updateUser);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockUserRepository.update).toBe('function');
    expect(mockUserRepository.update(updateUser)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  test('test in function delete()', async () => {
    const id = Uuid.v4();
    const mockUserRepository = new MockUserRepository();
    const { ok, message } = await mockUserRepository.delete(id);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockUserRepository.delete).toBe('function');
    expect(mockUserRepository.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
