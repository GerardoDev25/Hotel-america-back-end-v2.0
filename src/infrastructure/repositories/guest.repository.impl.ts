import { CreateGuestDto, UpdateGuestDto } from '@domain/dtos/guest';
import { GuestDatasource } from '@domain/datasources/guest.datasource';
import { GuestEntity } from '@domain/entities';
import { GuestRepository } from '@domain/repositories';
import { GuestPagination, GuestFilter } from '@domain/interfaces';

export class GuestRepositoryImpl extends GuestRepository {
  constructor(private readonly guestDatasource: GuestDatasource) {
    super();
  }

  getById(id: string): Promise<{ ok: boolean; guest: GuestEntity }> {
    return this.guestDatasource.getById(id);
  }

  getByParam(
    searchParam: GuestFilter
  ): Promise<{ ok: boolean; guest: GuestEntity | null }> {
    return this.guestDatasource.getByParam(searchParam);
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
