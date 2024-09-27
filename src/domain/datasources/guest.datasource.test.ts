/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateGuestDto, UpdateGuestDto } from '@domain/dtos/guest';
import { GuestDatasource } from '.';
import { GuestEntity } from '@domain/entities';
import { IGuest, GuestPagination } from '@domain/interfaces';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { variables } from '../variables';

describe('guest.datasource.ts', () => {
  const page = 2;
  const limit = 10;
  const fullName = Generator.randomName();

  const mockGuest = new GuestEntity({
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
  });

  const pagination: GuestPagination = {
    guests: [mockGuest],
    total: 0,
    page: 0,
    ulimit: 0,
    prev: null,
    next: null,
  };

  class MockGuestDatasource extends GuestDatasource {
    async getById(id: string): Promise<{ ok: boolean; guest: GuestEntity }> {
      return { ok: true, guest: mockGuest };
    }

    async getByParam(
      searchParam: Partial<Pick<IGuest, keyof IGuest>>
    ): Promise<{ ok: boolean; guest: GuestEntity | null }> {
      return { ok: true, guest: mockGuest };
    }

    async getAll(page: number, limit: number): Promise<GuestPagination> {
      return pagination;
    }

    async create(
      createGuestDto: CreateGuestDto
    ): Promise<{ ok: boolean; guest: GuestEntity }> {
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
  it('test in function getById()', async () => {
    const id = Uuid.v4();

    expect(typeof mockGuestDataSource.getById).toBe('function');
    expect(mockGuestDataSource.getById(id)).resolves.toEqual({
      ok: true,
      guest: mockGuest,
    });
  });

  it('test in function getByParam()', async () => {
    const di = Generator.randomIdentityNumber();

    expect(typeof mockGuestDataSource.getByParam).toBe('function');
    expect(mockGuestDataSource.getByParam({ di })).resolves.toEqual({
      ok: true,
      guest: mockGuest,
    });
  });

  it('test in function getAll()', async () => {
    const { guests } = await mockGuestDataSource.getAll(page, limit);

    expect(typeof mockGuestDataSource.getAll).toBe('function');
    expect(mockGuestDataSource.getAll(page, limit)).resolves.toEqual(
      pagination
    );

    expect(guests).toBeInstanceOf(Array);
    expect(guests).toHaveLength(1);
    guests.forEach((guest) => {
      expect(guest).toBeInstanceOf(GuestEntity);
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
    expect(guest).toBeInstanceOf(GuestEntity);
    expect(typeof mockGuestDataSource.create).toBe('function');
    expect(mockGuestDataSource.create(createGuest)).resolves.toEqual({
      ok: true,
      guest: expect.any(GuestEntity),
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
