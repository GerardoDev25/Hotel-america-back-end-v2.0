import { BookingDatasource } from '@domain/datasources';
import {
  CreateBookingDto,
  PaginationDto,
  UpdateBookingDto,
} from '@domain/dtos';
import { BookingService } from '.';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { CreateBooking } from '@src/domain/interfaces';

describe('booking.service.ts', () => {
  const mockBookingDatasource = {
    getAll: jest.fn().mockResolvedValue({ ok: true, bookings: [] }),
    getByParams: jest.fn().mockResolvedValue({ ok: true, bookings: [] }),
    getById: jest
      .fn()
      .mockResolvedValue({ ok: true, booking: { name: 'test' } }),
    create: jest
      .fn()
      .mockResolvedValue({ ok: true, booking: { name: 'test' } }),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as BookingDatasource;

  it('should to have been called with parameter (getAll)', async () => {
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new BookingService(mockBookingDatasource);

    await service.getAll(paginationDto);

    expect(mockBookingDatasource.getAll).toHaveBeenCalledTimes(1);
    expect(mockBookingDatasource.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  it('should to have been called with parameter (getByParams)', async () => {
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const params = { name: 'test', description: '' };
    const service = new BookingService(mockBookingDatasource);

    await service.getByParams(paginationDto, params);

    expect(mockBookingDatasource.getByParams).toHaveBeenCalledTimes(1);
    expect(mockBookingDatasource.getByParams).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      params
    );
  });

  it('should to have been called with parameter (getById)', async () => {
    const id = Uuid.v4();
    const service = new BookingService(mockBookingDatasource);

    await service.getById(id);

    expect(mockBookingDatasource.getById).toHaveBeenCalledTimes(1);
    expect(mockBookingDatasource.getById).toHaveBeenCalledWith(id);
  });

  it('should to have been called with parameter (create)', async () => {
    const data: CreateBooking = {
      amount: 2,
      description: 'test',
      name: Generator.randomName(),
      guestsNumber: 4,
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      roomNumber: 56,
    };
    const [errors, booking] = CreateBookingDto.create(data);
    const service = new BookingService(mockBookingDatasource);

    await service.create(booking!);

    expect(errors).toBeUndefined();
    expect(mockBookingDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockBookingDatasource.create).toHaveBeenCalledWith(booking);
  });

  it('should to have been called with parameter (update)', async () => {
    const [errors, booking] = UpdateBookingDto.create({ id: Uuid.v4() });
    const service = new BookingService(mockBookingDatasource);
    await service.update(booking!);

    expect(errors).toBeUndefined();
    expect(mockBookingDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockBookingDatasource.update).toHaveBeenCalledWith(booking);
  });

  it('should to have been called with parameter (delete)', async () => {
    const id = Uuid.v4();
    const service = new BookingService(mockBookingDatasource);
    await service.delete(id);

    expect(mockBookingDatasource.delete).toHaveBeenCalledTimes(1);
    expect(mockBookingDatasource.delete).toHaveBeenCalledWith(id);
  });
});
