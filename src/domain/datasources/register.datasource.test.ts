/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { IRegister, RegisterPagination } from '@domain/interfaces';
import { RegisterEntity } from '@domain/entities/';

import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';

import { RegisterDatasource } from './register.datasource';

describe('register.datasource.ts', () => {
  const page = 2;
  const limit = 10;

  const mockRegister = new RegisterEntity({
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
    checkOut: Generator.randomDate(),
    guestsNumber: 0,
    discount: 0,
    price: 0,
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
  });

  const mockRegister2 = new RegisterEntity({
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
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

  class MockRegisterDataSource implements RegisterDatasource {
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

  const mockRegisterDataSource = new MockRegisterDataSource();

  test('should get default value getById()', async () => {
    const id = Uuid.v4();
    const { ok, register } = await mockRegisterDataSource.getById(id);

    expect(typeof mockRegisterDataSource.getById).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
  });

  test('should get default value getByParam()', async () => {
    const userId = Uuid.v4();
    const { ok, register } = await mockRegisterDataSource.getByParam({
      userId,
    });

    expect(typeof mockRegisterDataSource.getByParam).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
  });

  test('should get default value getAll()', async () => {
    const { registers } = await mockRegisterDataSource.getAll(page, limit);

    expect(typeof mockRegisterDataSource.getAll).toBe('function');
    expect(registers).toBeInstanceOf(Array);
    expect(registers).toHaveLength(2);
    registers.forEach((register) => {
      expect(register).toBeInstanceOf(RegisterEntity);
    });
  });

  test('should get default behavior create()', async () => {
    const { id, ...rest } = mockRegister;
    const checkIn = new Date(rest.checkIn);
    const checkOut = rest.checkOut ? new Date(rest.checkOut) : undefined;
    const newRegister = { ...rest, checkIn, checkOut };

    const { ok, register } = await mockRegisterDataSource.create(newRegister);

    expect(typeof mockRegisterDataSource.create).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
    expect(mockRegisterDataSource.create(newRegister)).resolves.toEqual({
      ok: true,
      register: mockRegister,
    });
  });

  test('should get default behavior update()', async () => {
    const checkIn = new Date(mockRegister.checkIn);
    const checkOut = mockRegister.checkOut
      ? new Date(mockRegister.checkOut)
      : undefined;
    const newRegister = { ...mockRegister, checkIn, checkOut };

    const { ok, message } = await mockRegisterDataSource.update(newRegister);

    expect(typeof mockRegisterDataSource.update).toBe('function');
    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(mockRegisterDataSource.update(newRegister)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  test('should get default behavior delete()', async () => {
    const id = Uuid.v4();

    const { ok, message } = await mockRegisterDataSource.delete(id);

    expect(typeof mockRegisterDataSource.delete).toBe('function');
    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(mockRegisterDataSource.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
