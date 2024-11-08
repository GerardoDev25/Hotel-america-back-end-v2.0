import { BookingPagination, IBooking } from '@domain/interfaces';
import {
  CreateBookingDto,
  FilterBookingDto,
  UpdateBookingDto,
} from '@domain/dtos';

export abstract class BookingDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; booking: IBooking }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: FilterBookingDto
  ): Promise<BookingPagination>;

  abstract getAll(page: number, limit: number): Promise<BookingPagination>;

  abstract create(
    createBookingDto: CreateBookingDto
  ): Promise<{ ok: boolean; booking: IBooking }>;

  abstract update(
    updateBookingDto: UpdateBookingDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
