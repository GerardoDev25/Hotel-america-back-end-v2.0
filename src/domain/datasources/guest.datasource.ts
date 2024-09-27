import { CreateGuestDto, UpdateGuestDto } from '@domain/dtos/guest';
import { IGuest, GuestPagination } from '@domain/interfaces';
import { GuestEntity } from '@domain/entities';

export abstract class GuestDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; guest: GuestEntity }>;

  abstract getByParam(
    searchParam: Partial<Pick<IGuest, keyof IGuest>>
  ): Promise<{ ok: boolean; guest: GuestEntity | null }>;

  abstract getAll(page: number, limit: number): Promise<GuestPagination>;

  abstract create(
    createGuestDto: CreateGuestDto
  ): Promise<{ ok: boolean; guest: GuestEntity }>;

  abstract update(
    updateGuestDto: UpdateGuestDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
