/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateGuestDto, FilterGuestDto, UpdateGuestDto } from '@domain/dtos';
import { GuestPagination } from '@domain/interfaces';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { variables } from '@domain/variables';
import { GuestDatasource } from '.';
import { IGuest } from '../interfaces/guest.interface';

describe('guest.datasource.ts', () => {
  const page = 2;
  const limit = 10;
  const fullName = Generator.randomName();

  const mockGuest: IGuest = {
    id: Uuid.v4(),
    di: Generator.randomIdentityNumber(),
    city: Generator.randomCity(citiesList),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    phone: Generator.randomPhone(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    countryId: 'BO',
    registerId: Uuid.v4(),
    dateOfBirth: Generator.randomDate(),
    checkIn: Generator.randomDate(),
    checkOut: Generator.randomDate(),
  };

  const pagination: GuestPagination = {
    guests: [mockGuest],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  class MockGuestDatasource extends GuestDatasource {
    async getById(id: string): Promise<{ ok: boolean; guest: IGuest }> {
      return { ok: true, guest: mockGuest };
    }

    async getByParams(
      page: number,
      limit: number,
      searchParam: FilterGuestDto
    ): Promise<GuestPagination> {
      return pagination;
    }

    async getAll(page: number, limit: number): Promise<GuestPagination> {
      return pagination;
    }

    async create(
      createGuestDto: CreateGuestDto
    ): Promise<{ ok: boolean; guest: IGuest }> {
      return { ok: true, guest: mockGuest };
    }

    async update(
      updateGuestDto: UpdateGuestDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'Guest updated successfully' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'Guest deleted successfully' };
    }
  }

  const mockGuestDataSource = new MockGuestDatasource();

  it('test in function getAll()', async () => {
    const { guests } = await mockGuestDataSource.getAll(page, limit);

    expect(typeof mockGuestDataSource.getAll).toBe('function');
    expect(mockGuestDataSource.getAll(page, limit)).resolves.toEqual(
      pagination
    );

    expect(guests).toBeInstanceOf(Array);
    expect(guests).toHaveLength(1);
    guests.forEach((guest) => {
      expect(guest).toMatchObject({
        id: expect.any(String),
        di: expect.any(String),
        checkIn: expect.any(String),
        checkOut: expect.any(String),
        dateOfBirth: expect.any(String),
        city: expect.any(String),
        name: expect.any(String),
        lastName: expect.any(String),
        phone: expect.any(String),
        roomNumber: expect.any(Number),
        countryId: expect.any(String),
        registerId: expect.any(String),
      });
    });
  });

  it('test in function getByParams()', async () => {
    const params: FilterGuestDto = { di: Generator.randomIdentityNumber() };

    const result = await mockGuestDataSource.getByParams(page, limit, params);

    expect(typeof mockGuestDataSource.getByParams).toBe('function');
    expect(result).toEqual(pagination);
  });

  it('test in function getById()', async () => {
    const id = Uuid.v4();

    expect(typeof mockGuestDataSource.getById).toBe('function');
    expect(mockGuestDataSource.getById(id)).resolves.toEqual({
      ok: true,
      guest: mockGuest,
    });
  });

  it('test in function create()', async () => {
    const { id, ...rest } = mockGuest;
    const checkIn = new Date(rest.checkIn);
    const dateOfBirth = new Date(rest.dateOfBirth);
    const checkOut = rest.checkOut ? new Date(rest.checkOut) : undefined;
    const createGuest = { ...rest, checkIn, checkOut, dateOfBirth };

    const { ok, guest } = await mockGuestDataSource.create(createGuest);

    expect(ok).toBeTruthy();
    expect(guest).toMatchObject({
      id: expect.any(String),
      di: expect.any(String),
      checkIn: expect.any(String),
      checkOut: expect.any(String),
      dateOfBirth: expect.any(String),
      city: expect.any(String),
      name: expect.any(String),
      lastName: expect.any(String),
      phone: expect.any(String),
      roomNumber: expect.any(Number),
      countryId: expect.any(String),
      registerId: expect.any(String),
    });
    expect(typeof mockGuestDataSource.create).toBe('function');
    expect(mockGuestDataSource.create(createGuest)).resolves.toEqual({
      ok: true,
      guest: expect.any(Object),
    });
  });

  it('test in function update()', async () => {
    const { dateOfBirth, checkIn, checkOut, ...rest } = mockGuest;

    const { ok, message } = await mockGuestDataSource.update(rest);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockGuestDataSource.update).toBe('function');
    expect(mockGuestDataSource.update(rest)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  it('test in function delete()', async () => {
    const id = Uuid.v4();
    const { ok, message } = await mockGuestDataSource.delete(id);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockGuestDataSource.delete).toBe('function');
    expect(mockGuestDataSource.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
