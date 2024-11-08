import { BookingDatasource } from '@domain/datasources';
import { LoggerService } from '@presentation/services';
import {
  CreateBookingDto,
  FilterBookingDto,
  UpdateBookingDto,
} from '@domain/dtos';
import { CustomError } from '@domain/error';
import {
  IBooking,
  IFilterBookingDto,
  BookingPagination,
} from '@domain/interfaces';
import { Booking } from '@prisma/client';
import { prisma } from '@src/data/postgres';
import { cleanObject, HandleDate, pagination } from '@src/utils';

export class BookingDatasourceImpl extends BookingDatasource {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  private handleError(error: any) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      this.logger.error((error as Error).message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  private transformObject(entity: Booking): IBooking {
    return {
      ...entity,
      checkIn: entity.checkIn.toISOString().split('T').at(0) ?? '',
      checkOut: entity.checkOut?.toISOString().split('T').at(0) ?? undefined,
      createdAt: entity.createdAt.toISOString().split('T').at(0) ?? '',
      roomNumber: entity.roomNumber ? entity.roomNumber : undefined,
    };
  }

  async getById(id: string): Promise<{ ok: boolean; booking: IBooking }> {
    try {
      const booking = await prisma.booking.findUnique({ where: { id } });

      if (!booking) {
        throw CustomError.notFound(`booking with id: ${id} not found`);
      }

      return { ok: true, booking: this.transformObject(booking) };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByParams(
    page: number,
    limit: number,
    searchParam: FilterBookingDto
  ): Promise<BookingPagination> {
    try {
      const where: IFilterBookingDto = cleanObject(searchParam);
      if (searchParam.checkIn)
        where.checkIn = {
          gte: searchParam.checkIn,
          lt: HandleDate.nextDay(searchParam.checkIn),
        };

      if (searchParam.checkOut)
        where.checkOut = {
          gte: searchParam.checkOut,
          lt: HandleDate.nextDay(searchParam.checkOut),
        };

      if (searchParam.createdAt)
        where.createdAt = {
          gte: searchParam.createdAt,
          lt: HandleDate.nextDay(searchParam.createdAt),
        };

      const [totalDB, bookingsDb] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const bookings = bookingsDb.map((booking) =>
        this.transformObject(booking)
      );
      const total = bookingsDb.length === 0 ? 0 : totalDB;
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'booking/get-by-params',
      });

      return { page, limit, total, next, prev, bookings };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAll(page: number, limit: number): Promise<BookingPagination> {
    try {
      const [total, bookingsDb] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const bookings = bookingsDb.map((booking) =>
        this.transformObject(booking)
      );

      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'booking',
      });

      return { page, limit, total, next, prev, bookings };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    createBookingDto: CreateBookingDto
  ): Promise<{ ok: boolean; booking: IBooking }> {
    try {
      const newBooking = await prisma.booking.create({
        data: createBookingDto,
      });
      return { ok: true, booking: this.transformObject(newBooking) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async update(
    updateBookingDto: UpdateBookingDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updateBookingDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.register.update({ where: { id }, data });
      return { ok: true, message: 'booking updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    await this.getById(id);

    try {
      await prisma.booking.delete({ where: { id } });
      return { ok: true, message: 'booking deleted successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
