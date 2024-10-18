import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import {
  RegisterCheckOut,
  RegisterPagination,
  RegisterFilter,
} from '@domain/interfaces';
import { GuestEntity, RegisterEntity } from '@domain/entities';
import { CreateGuestDto } from '@domain/dtos/guest';

export abstract class RegisterDatasource {
  abstract getAll(page: number, limit: number): Promise<RegisterPagination>;

  abstract getById(
    id: string
  ): Promise<{ ok: boolean; register: RegisterEntity }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: RegisterFilter
  ): Promise<RegisterPagination>;

  abstract create(
    createRegisterDto: CreateRegisterDto
  ): Promise<{ ok: boolean; register: RegisterEntity }>;

  abstract checkIn(data: {
    registerDto: CreateRegisterDto;
    guestDtos: CreateGuestDto[];
  }): Promise<{ ok: boolean; register: RegisterEntity; guests: GuestEntity[] }>;

  abstract checkOut(
    id: string
  ): Promise<{ ok: boolean; registerCheckOutDetail: RegisterCheckOut }>;

  abstract update(
    updaterRegisterDto: UpdateRegisterDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
