import { RegisterDatasource } from '@domain/datasources';
import { GuestEntity, RegisterEntity } from '@domain/entities';
import { RegisterRepository } from '@domain/repositories';
import { RegisterPagination, RegisterCheckOut } from '@domain/interfaces';
import {
  CreateGuestDto,
  CreateRegisterDto,
  FilterRegisterDto,
  UpdateRegisterDto,
} from '@domain/dtos';

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
    searchParam: FilterRegisterDto
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
