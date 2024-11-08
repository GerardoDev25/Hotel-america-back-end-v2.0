import { BookingDatasource } from '@domain/datasources';
import {
  CreateBookingDto,
  FilterBookingDto,
  UpdateBookingDto,
  PaginationDto,
} from '@domain/dtos';

export class BookingService {
  constructor(private readonly bookingDatasource: BookingDatasource) {}

  getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.bookingDatasource.getAll(page, limit);
  }

  getByParams(paginationDto: PaginationDto, filterRoomDto: FilterBookingDto) {
    const { page, limit } = paginationDto;
    return this.bookingDatasource.getByParams(page, limit, filterRoomDto);
  }

  getById(id: string) {
    return this.bookingDatasource.getById(id);
  }

  create(createBookingDto: CreateBookingDto) {
    return this.bookingDatasource.create(createBookingDto);
  }

  async update(updateBookingDto: UpdateBookingDto) {
    return this.bookingDatasource.update(updateBookingDto);
  }

  async delete(id: string) {
    return this.bookingDatasource.delete(id);
  }
}
