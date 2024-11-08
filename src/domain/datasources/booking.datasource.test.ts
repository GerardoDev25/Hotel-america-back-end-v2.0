/* eslint-disable @typescript-eslint/no-unused-vars */
import { Uuid } from '@src/adapters';
import {
  BookingPagination,
  IBooking,
  IFilterBookingDto,
} from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { BookingDatasource } from '.';
import { CreateBookingDto, UpdateBookingDto } from '../dtos';

describe('booking.datasource.ts', () => {
  const page = 2;
  const limit = 10;

  const mockBooking: IBooking = {
    id: Uuid.v4(),
    createdAt: Generator.randomDate(),
    amount: 100,
    description: 'test',
    name: Generator.randomName(),
    guestsNumber: 2,
    checkIn: Generator.randomDate(),
    checkOut: Generator.randomDate(),
    roomNumber: 23,
  };

  const pagination: BookingPagination = {
    bookings: [mockBooking],
    total: 1,
    page: 1,
    limit: 1,
    prev: null,
    next: null,
  };

  class MockBookingDataSource implements BookingDatasource {
    async getById(id: string): Promise<{ ok: boolean; booking: IBooking }> {
      return { ok: true, booking: mockBooking };
    }

    async getByParams(
      page: number,
      limit: number,
      searchParam: IFilterBookingDto
    ): Promise<BookingPagination> {
      return pagination;
    }

    async getAll(page: number, limit: number): Promise<BookingPagination> {
      return pagination;
    }

    async create(
      createBookingDto: CreateBookingDto
    ): Promise<{ ok: boolean; booking: IBooking }> {
      return { ok: true, booking: mockBooking };
    }

    async update(
      updateBookingDto: UpdateBookingDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }
  }

  const mockBookingDatasource = new MockBookingDataSource();

  it('test in function (getById)', async () => {
    const id = Uuid.v4();

    expect(typeof mockBookingDatasource.getById).toBe('function');
    expect(mockBookingDatasource.getById(id)).resolves.toEqual({
      ok: true,
      booking: mockBooking,
    });
  });

  it('test in function (getByParam)', async () => {
    const amount = 100;

    expect(typeof mockBookingDatasource.getByParams).toBe('function');
    expect(
      mockBookingDatasource.getByParams(page, limit, { amount })
    ).resolves.toEqual(pagination);
  });

  it('test in function (getAll)', async () => {
    const { bookings } = await mockBookingDatasource.getAll(page, limit);

    expect(typeof mockBookingDatasource.getAll).toBe('function');
    expect(mockBookingDatasource.getAll(page, limit)).resolves.toEqual(
      pagination
    );

    expect(bookings).toBeInstanceOf(Array);
    bookings.forEach((booking) => {
      expect(booking).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(String),
        amount: expect.any(Number),
        description: expect.any(String),
        name: expect.any(String),
        guestsNumber: expect.any(Number),
        checkIn: expect.any(String),
      });
    });
  });

  it('test in function (create)', async () => {
    const { id, checkIn, checkOut, ...rest } = mockBooking;
    const createBooking: CreateBookingDto = {
      ...rest,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut!),
    };

    const { ok, booking } = await mockBookingDatasource.create(createBooking);

    expect(ok).toBeTruthy();
    expect(booking).toBeDefined();
    expect(typeof mockBookingDatasource.create).toBe('function');
    expect(mockBookingDatasource.create(createBooking)).resolves.toEqual({
      ok: true,
      booking: expect.any(Object),
    });
  });

  it('test in function (update)', async () => {
    const { checkIn, checkOut, ...rest } = mockBooking;

    const { ok, message } = await mockBookingDatasource.update({
      ...rest,
      checkIn: new Date(),
    });

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockBookingDatasource.update).toBe('function');
    expect(
      mockBookingDatasource.update({
        ...rest,
        checkIn: new Date(),
      })
    ).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  it('test in function (delete)', async () => {
    const id = Uuid.v4();
    const { ok, message } = await mockBookingDatasource.delete(id);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockBookingDatasource.delete).toBe('function');
    expect(mockBookingDatasource.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
