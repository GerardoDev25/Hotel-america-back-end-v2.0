import { Uuid } from '@src/adapters';
import { BookingController } from '.';
import { Generator } from '@src/utils/generator';
import {
  CreateBookingDto,
  FilterBookingDto,
  PaginationDto,
  UpdateBookingDto,
} from '@domain/dtos';
import { BookingPagination, FilterBooking, IBooking } from '@domain/interfaces';
import { CustomError } from '@src/domain/error';

describe('booking.controller.ts', () => {
  const booking1: IBooking = {
    id: Uuid.v4(),
    createdAt: Generator.randomDate(),
    amount: 100,
    description: 'test',
    name: Generator.randomName(),
    guestsNumber: 12,
    checkIn: Generator.randomDate(),
    checkOut: Generator.randomDate(),
    roomNumber: 12,
  };

  const pagination: BookingPagination = {
    bookings: [booking1],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  it('should return all bookings when is called (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 } } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should retrieve all bookings with default pagination when no query parameters are provided (getAll)', async () => {
    const req = { query: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(pagination);
    expect(mockService.getAll).toHaveBeenCalledWith(expect.any(PaginationDto));
  });

  it('should  return error if is not well paginated (getAll)', async () => {
    const req = { query: { page: 'hol' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['Page and limit must be a number'],
      ok: false,
    });
  });

  it('should return all bookings when is called (getByParams)', async () => {
    const body: FilterBooking = {
      amount: 12,
      name: Generator.randomName(),
      guestsNumber: 12,
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      roomNumber: 12,
    };

    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 }, body } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.getByParams(req, res);

    expect(mockService.getByParams).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should retrieve all bookings with default pagination when no query parameters are provided (getByParams)', async () => {
    const body = {};
    const req = { query: {}, body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.getByParams(req, res);

    expect(res.json).toHaveBeenCalledWith(pagination);
    expect(mockService.getByParams).toHaveBeenCalledWith(
      expect.any(PaginationDto),
      expect.any(FilterBookingDto)
    );
  });

  it('should  return error if is not well paginated (getByParams)', async () => {
    const req = { query: { page: 'hol' }, body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.getByParams(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['Page and limit must be a number'],
      ok: false,
    });
  });

  it('should throw error when booking ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(booking1),
    } as any;
    const bookingController = new BookingController(mockService);

    try {
      await bookingController.getById(req, res);
    } catch (error) {
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
      expect(mockService.getById).toHaveBeenCalledWith('non-existent-id');
      expect(error).toBeInstanceOf(CustomError);
    }
  });

  it('should create a new room when createRoom is called (create)', async () => {
    const req = { body: booking1 } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = booking1;
    const [errors, bookingDto] = CreateBookingDto.create({ ...rest });

    const mockService = {
      create: jest.fn().mockResolvedValue(bookingDto),
    } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.create(req, res);

    expect(errors).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(bookingDto);
    expect(mockService.create).toHaveBeenCalledWith(bookingDto);
  });

  it('should update a room when is called (update)', async () => {
    const req = { body: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const data = { ok: true, message: '' };
    const mockService = { update: jest.fn().mockResolvedValue(data) } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(data);
    expect(mockService.update).toHaveBeenCalledWith(
      expect.any(UpdateBookingDto)
    );
  });

  it('should delete a booking when is called (delete)', async () => {
    const req = { params: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const data = { ok: true, message: '' };
    const mockService = { delete: jest.fn().mockResolvedValue(data) } as any;
    const bookingController = new BookingController(mockService);

    await bookingController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(req.params.id);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});
