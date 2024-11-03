import { CreateGuestDto, FilterGuestDto, UpdateGuestDto } from '@domain/dtos';
import { GuestDatasource } from '@domain/datasources/guest.datasource';
import { GuestEntity } from '@domain/entities';
import { GuestRepository } from '@domain/repositories';
import { GuestPagination } from '@domain/interfaces';

export class GuestRepositoryImpl extends GuestRepository {
  constructor(private readonly guestDatasource: GuestDatasource) {
    super();
  }

  getById(id: string): Promise<{ ok: boolean; guest: GuestEntity }> {
    return this.guestDatasource.getById(id);
  }

  getByParams(
    page: number,
    limit: number,
    searchParam: FilterGuestDto
  ): Promise<GuestPagination> {
    return this.guestDatasource.getByParams(page, limit, searchParam);
  }

  getAll(page: number, limit: number): Promise<GuestPagination> {
    return this.guestDatasource.getAll(page, limit);
  }

  create(
    createGuestDto: CreateGuestDto
  ): Promise<{ ok: boolean; guest: GuestEntity }> {
    return this.guestDatasource.create(createGuestDto);
  }

  update(
    updateGuestDto: UpdateGuestDto
  ): Promise<{ ok: boolean; message: string }> {
    return this.guestDatasource.update(updateGuestDto);
  }

  delete(id: string): Promise<{ ok: boolean; message: string }> {
    return this.guestDatasource.delete(id);
  }
}
