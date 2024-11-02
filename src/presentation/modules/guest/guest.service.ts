import { GuestDatasource } from '@domain/datasources';
import { PaginationDto } from '@domain/dtos/share';
import {
  CreateGuestDto,
  UpdateGuestDto,
  FilterGuestDto,
} from '@domain/dtos/guest';

export class GuestService {
  constructor(private readonly guestDatasource: GuestDatasource) {}

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.guestDatasource.getAll(page, limit);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterGuestDto: FilterGuestDto
  ) {
    const { page, limit } = paginationDto;
    return this.guestDatasource.getByParams(page, limit, filterGuestDto);
  }

  async getById(id: string) {
    return this.guestDatasource.getById(id);
  }

  async create(createGuestDto: CreateGuestDto) {
    return this.guestDatasource.create(createGuestDto);
  }

  async update(updateGuestDto: UpdateGuestDto) {
    return this.guestDatasource.update(updateGuestDto);
  }

  async delete(id: string) {
    return this.guestDatasource.delete(id);
  }
}
