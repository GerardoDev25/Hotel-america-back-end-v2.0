import { GuestPagination, IGuest } from '@domain/interfaces';
import { CreateGuestDto, FilterGuestDto, UpdateGuestDto } from '@domain/dtos';

export abstract class GuestDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; guest: IGuest }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: FilterGuestDto
  ): Promise<GuestPagination>;

  abstract getAll(page: number, limit: number): Promise<GuestPagination>;

  abstract create(
    createGuestDto: CreateGuestDto
  ): Promise<{ ok: boolean; guest: IGuest }>;

  abstract update(
    updateGuestDto: UpdateGuestDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
