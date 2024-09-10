import { Uuid } from '../../adapters';
import { generateRandomDate } from '../../utils/generator';
import { CreateRegisterDto, UpdateRegisterDto } from '../dtos/register';
import { RegisterEntity } from '../entities/register.entity';
import { IRegister, RegisterPagination } from '../interfaces';
import { RegisterRepository } from './register.repository';

describe('register.repository.ts', () => {
  const page = 2;
  const limit = 10;

  const mockRegister = new RegisterEntity({
    id: Uuid.v4(),
    checkIn: generateRandomDate(),
    checkOut: generateRandomDate(),
    guestsNumber: 0,
    discount: 0,
    price: 0,
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
  });

  const mockRegister2 = new RegisterEntity({
    id: Uuid.v4(),
    checkIn: generateRandomDate(),
    guestsNumber: 0,
    discount: 0,
    price: 0,
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
  });

  const registerPagination: RegisterPagination = {
    registers: [mockRegister, mockRegister2],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  class MockRegisterRepository implements RegisterRepository {
    async getById(
      id: string
    ): Promise<{ ok: boolean; register: RegisterEntity }> {
      return { ok: true, register: mockRegister };
    }

    async getByParam(
      searchParam: Partial<Pick<IRegister, keyof IRegister>>
    ): Promise<{ ok: boolean; register: RegisterEntity | null }> {
      return { ok: true, register: mockRegister };
    }

    async getAll(page: number, limit: number): Promise<RegisterPagination> {
      return registerPagination;
    }

    async create(
      createRegisterDto: CreateRegisterDto
    ): Promise<{ ok: boolean; register: RegisterEntity }> {
      return { ok: true, register: mockRegister };
    }

    async update(
      updaterRegisterDto: UpdateRegisterDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'Register deleted' };
    }
  }

  test('should get default value getById()', async () => {
    const id = Uuid.v4();
    const mockRegisterRepository = new MockRegisterRepository();
    const { ok, register } = await mockRegisterRepository.getById(id);

    expect(typeof mockRegisterRepository.getById).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
  });

  test('should get default value getByParam()', async () => {
    const userId = Uuid.v4();
    const mockRegisterRepository = new MockRegisterRepository();
    const { ok, register } = await mockRegisterRepository.getByParam({
      userId,
    });

    expect(typeof mockRegisterRepository.getByParam).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
  });

  test('should get default value getAll()', async () => {
    const mockRegisterRepository = new MockRegisterRepository();
    const { registers } = await mockRegisterRepository.getAll(page, limit);

    expect(typeof mockRegisterRepository.getAll).toBe('function');
    expect(registers).toBeInstanceOf(Array);
    expect(registers).toHaveLength(2);
    registers.forEach((register) => {
      expect(register).toBeInstanceOf(RegisterEntity);
    });
  });

  test('should get default behavior create()', async () => {
    const mockRegisterRepository = new MockRegisterRepository();

    const { id, ...rest } = mockRegister;
    const checkIn = new Date(rest.checkIn);
    const checkOut = rest.checkOut ? new Date(rest.checkOut) : undefined;
    const newRegister = { ...rest, checkIn, checkOut };

    const { ok, register } = await mockRegisterRepository.create(newRegister);

    expect(typeof mockRegisterRepository.create).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
    expect(mockRegisterRepository.create(newRegister)).resolves.toEqual({
      ok: true,
      register: mockRegister,
    });
  });

  test('should get default behavior update()', async () => {
    const mockRegisterRepository = new MockRegisterRepository();

    const checkIn = new Date(mockRegister.checkIn);
    const checkOut = mockRegister.checkOut
      ? new Date(mockRegister.checkOut)
      : undefined;
    const newRegister = { ...mockRegister, checkIn, checkOut };

    const { ok, message } = await mockRegisterRepository.update(newRegister);

    expect(typeof mockRegisterRepository.update).toBe('function');
    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(mockRegisterRepository.update(newRegister)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  test('should get default behavior delete()', async () => {
    const id = Uuid.v4();
    const mockRegisterRepository = new MockRegisterRepository();

    const { ok, message } = await mockRegisterRepository.delete(id);

    expect(typeof mockRegisterRepository.delete).toBe('function');
    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(mockRegisterRepository.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
