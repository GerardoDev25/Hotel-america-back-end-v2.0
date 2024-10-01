/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { CreateGuestDto } from '@domain/dtos/guest';
import { IRegister, RegisterPagination } from '@domain/interfaces';
import { RegisterEntity, GuestEntity } from '@domain/entities';
import { variables } from '@domain/variables';

import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { RegisterRepository } from '.';

describe('register.repository.ts', () => {
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

  const fullName = Generator.randomName();

  const mockGuest = new GuestEntity({
    id: Uuid.v4(),
    di: Generator.randomIdentityNumber(),
    checkIn: Generator.randomDate(),
    dateOfBirth: Generator.randomDate(),
    city: Generator.randomCity(citiesList),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    phone: Generator.randomPhone(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    countryId: 'BO',
    registerId: Uuid.v4(),
  });

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

    async checkIn(data: {
      registerDto: CreateRegisterDto;
      guestDtos: CreateGuestDto[];
    }): Promise<{
      ok: boolean;
      register: RegisterEntity;
      guests: GuestEntity[];
    }> {
      return { ok: true, register: mockRegister, guests: [mockGuest] };
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
    // const checkIn = new Date(rest.checkIn);
    const checkOut = rest.checkOut ? new Date(rest.checkOut) : undefined;
    // const newRegister = { ...rest, checkIn, checkOut };
    const newRegister = { ...rest, checkOut };

    const { ok, register } = await mockRegisterRepository.create(newRegister);

    expect(typeof mockRegisterRepository.create).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
    expect(mockRegisterRepository.create(newRegister)).resolves.toEqual({
      ok: true,
      register: mockRegister,
    });
  });

  test('should get default behavior checkIn()', async () => {
    const mockRegisterRepository = new MockRegisterRepository();

    const { id, ...restRegister } = mockRegister;
    // const checkIn = new Date(restRegister.checkIn);
    const checkOut = restRegister.checkOut
      ? new Date(restRegister.checkOut)
      : undefined;
    // const registerDto = { ...restRegister, checkIn, checkOut };
    const registerDto = { ...restRegister, checkOut };

    const { id: guestId, ...restGuest } = mockGuest;
    const guestDateOfBirth = new Date(restGuest.dateOfBirth);
    const guestCheckOut = restGuest.checkOut
      ? new Date(restGuest.checkOut)
      : undefined;

    const guestDto: CreateGuestDto = {
      ...restGuest,
      dateOfBirth: guestDateOfBirth,
      checkOut: guestCheckOut,
    };

    const { ok, register, guests } = await mockRegisterRepository.checkIn({
      registerDto,
      guestDtos: [guestDto],
    });

    expect(typeof mockRegisterRepository.checkIn).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
    expect(guests[0]).toBeInstanceOf(GuestEntity);
    expect(
      mockRegisterRepository.checkIn({
        registerDto,
        guestDtos: [guestDto],
      })
    ).resolves.toEqual({
      ok: true,
      register: mockRegister,
      guests: [mockGuest],
    });
  });

  test('should get default behavior update()', async () => {
    const mockRegisterRepository = new MockRegisterRepository();

    // const checkIn = new Date(mockRegister.checkIn);
    const checkOut = mockRegister.checkOut
      ? new Date(mockRegister.checkOut)
      : undefined;
    // const newRegister = { ...mockRegister, checkIn, checkOut };
    const newRegister = { ...mockRegister, checkOut };

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
