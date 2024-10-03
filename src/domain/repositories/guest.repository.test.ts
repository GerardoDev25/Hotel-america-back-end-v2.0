/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateGuestDto, UpdateGuestDto } from '@domain/dtos/guest';
import { GuestRepository } from '.';
import { GuestEntity } from '@domain/entities';
import { IGuest, GuestPagination } from '@domain/interfaces';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { variables } from '../variables';

describe('guest.repository.ts', () => {
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
    limit: 0,
    prev: null,
    next: null,
  };

  class MockGuestRepository extends GuestRepository {
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

  const mockGuestRepository = new MockGuestRepository();
  it('test in function getById()', async () => {
    const id = Uuid.v4();

    expect(typeof mockGuestRepository.getById).toBe('function');
    expect(mockGuestRepository.getById(id)).resolves.toEqual({
      ok: true,
      guest: mockGuest,
    });
  });

  it('test in function getByParam()', async () => {
    const di = Generator.randomIdentityNumber();

    expect(typeof mockGuestRepository.getByParam).toBe('function');
    expect(mockGuestRepository.getByParam({ di })).resolves.toEqual({
      ok: true,
      guest: mockGuest,
    });
  });

  it('test in function getAll()', async () => {
    const { guests } = await mockGuestRepository.getAll(page, limit);

    expect(typeof mockGuestRepository.getAll).toBe('function');
    expect(mockGuestRepository.getAll(page, limit)).resolves.toEqual(
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

    const { ok, guest } = await mockGuestRepository.create(createGuest);

    expect(ok).toBeTruthy();
    expect(guest).toBeInstanceOf(GuestEntity);
    expect(typeof mockGuestRepository.create).toBe('function');
    expect(mockGuestRepository.create(createGuest)).resolves.toEqual({
      ok: true,
      guest: expect.any(GuestEntity),
    });
  });

  it('test in function update()', async () => {
    const { dateOfBirth, checkIn, checkOut, ...rest } = mockGuest;

    const { ok, message } = await mockGuestRepository.update(rest);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockGuestRepository.update).toBe('function');
    expect(mockGuestRepository.update(rest)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  it('test in function delete()', async () => {
    const id = Uuid.v4();
    const { ok, message } = await mockGuestRepository.delete(id);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockGuestRepository.delete).toBe('function');
    expect(mockGuestRepository.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
