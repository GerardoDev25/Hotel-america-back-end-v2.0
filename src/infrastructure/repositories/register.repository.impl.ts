import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { RegisterDatasource } from '@domain/datasources';
import { GuestEntity, RegisterEntity } from '@domain/entities';
import { RegisterRepository } from '@domain/repositories';
import { CreateGuestDto } from '@domain/dtos/guest';
import {
  RegisterPagination,
  RegisterCheckOut,
  RegisterFilter,
} from '@domain/interfaces';

export class RegisterRepositoryImpl extends RegisterRepository {
  constructor(private readonly registerDataSource: RegisterDatasource) {
    super();
  }

  getAll(page: number, limit: number): Promise<RegisterPagination> {
    return this.registerDataSource.getAll(page, limit);
  }

  getById(id: string): Promise<{ ok: boolean; register: RegisterEntity }> {
    return this.registerDataSource.getById(id);
  }

  getByParams(
    page: number,
    limit: number,
    searchParam: RegisterFilter
  ): Promise<RegisterPagination> {
    return this.registerDataSource.getByParams(page, limit, searchParam);
  }

  create(
    createRegisterDto: CreateRegisterDto
  ): Promise<{ ok: boolean; register: RegisterEntity }> {
    return this.registerDataSource.create(createRegisterDto);
  }

  checkIn(data: {
    registerDto: CreateRegisterDto;
    guestDtos: CreateGuestDto[];
  }): Promise<{
    ok: boolean;
    register: RegisterEntity;
    guests: GuestEntity[];
  }> {
    return this.registerDataSource.checkIn(data);
  }

  async checkOut(
    id: string
  ): Promise<{ ok: boolean; registerCheckOutDetail: RegisterCheckOut }> {
    return this.registerDataSource.checkOut(id);
  }

  update(
    updaterRegisterDto: UpdateRegisterDto
  ): Promise<{ ok: boolean; message: string }> {
    return this.registerDataSource.update(updaterRegisterDto);
  }

  delete(id: string): Promise<{ ok: boolean; message: string }> {
    return this.registerDataSource.delete(id);
  }
}
