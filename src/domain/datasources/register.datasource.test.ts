/* eslint-disable @typescript-eslint/no-unused-vars */
import { variables } from '@domain/variables';
import { CreateGuestDto } from '@domain/dtos/guest';
import { GuestEntity, RegisterEntity } from '@domain/entities/';
import { RegisterCheckOut, RegisterPagination } from '@domain/interfaces';
import {
  CreateRegisterDto,
  FilterRegisterDto,
  UpdateRegisterDto,
} from '@domain/dtos/register';

import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';

import { citiesList } from '@src/data/seed';
import { RegisterDatasource } from '.';

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

  const registerCheckOut: RegisterCheckOut = {
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
    checkOut: Generator.randomDate(),
    discount: 0,
    price: 0,
    roomNumber: 0,
    totalCharges: 0,
    totalPayments: 0,
    guests: [],
    charges: [],
    payments: [],
  };

  const mockRegister2 = new RegisterEntity({
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
    guestsNumber: 0,
    discount: 0,
    price: 0,
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
  });

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

  const pagination: RegisterPagination = {
    registers: [mockRegister, mockRegister2],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  class MockRegisterDataSource implements RegisterDatasource {
    async getAll(page: number, limit: number): Promise<RegisterPagination> {
      return pagination;
    }

    async getByParams(
      page: number,
      limit: number,
      searchParam: FilterRegisterDto
    ): Promise<RegisterPagination> {
      return pagination;
    }

    async getById(
      id: string
    ): Promise<{ ok: boolean; register: RegisterEntity }> {
      return { ok: true, register: mockRegister };
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

    async checkOut(
      id: string
    ): Promise<{ ok: boolean; registerCheckOutDetail: RegisterCheckOut }> {
      return { ok: true, registerCheckOutDetail: registerCheckOut };
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

  it('should get default value (getAll)', async () => {
    const { registers } = await mockRegisterDataSource.getAll(page, limit);

    expect(typeof mockRegisterDataSource.getAll).toBe('function');
    expect(registers).toBeInstanceOf(Array);
    expect(registers).toHaveLength(2);
    registers.forEach((register) => {
      expect(register).toBeInstanceOf(RegisterEntity);
    });
  });

  it('should get default value (getByParams)', async () => {
    const params = { userId: Uuid.v4() };

    const { registers } = await mockRegisterDataSource.getByParams(
      page,
      limit,
      params
    );

    expect(typeof mockRegisterDataSource.getByParams).toBe('function');
    expect(registers).toBeInstanceOf(Array);
    expect(registers).toHaveLength(2);
    registers.forEach((register) => {
      expect(register).toBeInstanceOf(RegisterEntity);
    });
  });

  it('should get default value (getById)', async () => {
    const id = Uuid.v4();
    const { ok, register } = await mockRegisterDataSource.getById(id);

    expect(typeof mockRegisterDataSource.getById).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
  });

  it('should get default behavior (create)', async () => {
    const { id, ...rest } = mockRegister;
    const checkOut = rest.checkOut ? new Date(rest.checkOut) : undefined;
    const newRegister = { ...rest, checkOut };

    const { ok, register } = await mockRegisterDataSource.create(newRegister);

    expect(typeof mockRegisterDataSource.create).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
    expect(mockRegisterDataSource.create(newRegister)).resolves.toEqual({
      ok: true,
      register: mockRegister,
    });
  });

  it('should get default behavior (checkIn)', async () => {
    const { id, ...restRegister } = mockRegister;
    const checkOut = restRegister.checkOut
      ? new Date(restRegister.checkOut)
      : undefined;
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

    const { ok, register, guests } = await mockRegisterDataSource.checkIn({
      registerDto,
      guestDtos: [guestDto],
    });

    expect(typeof mockRegisterDataSource.checkIn).toBe('function');
    expect(ok).toBeTruthy();
    expect(register).toBeInstanceOf(RegisterEntity);
    expect(guests[0]).toBeInstanceOf(GuestEntity);
    expect(
      mockRegisterDataSource.checkIn({
        registerDto,
        guestDtos: [guestDto],
      })
    ).resolves.toEqual({
      ok: true,
      register: mockRegister,
      guests: [mockGuest],
    });
  });

  it('should get default behavior (checkOut)', async () => {
    const id = Uuid.v4();

    const { ok, registerCheckOutDetail } =
      await mockRegisterDataSource.checkOut(id);

    expect(typeof mockRegisterDataSource.checkOut).toBe('function');
    expect(ok).toBeTruthy();
    expect(registerCheckOutDetail).toBeInstanceOf(Object);
  });

  it('should get default behavior (update)', async () => {
    const checkOut = mockRegister.checkOut
      ? new Date(mockRegister.checkOut)
      : undefined;
    const newRegister = { ...mockRegister, checkOut };

    const { ok, message } = await mockRegisterDataSource.update(newRegister);

    expect(typeof mockRegisterDataSource.update).toBe('function');
    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(mockRegisterDataSource.update(newRegister)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  it('should get default behavior (delete)', async () => {
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
