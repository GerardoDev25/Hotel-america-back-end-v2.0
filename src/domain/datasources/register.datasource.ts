import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { IRegister, RegisterPagination } from '@domain/interfaces';
import { RegisterEntity } from '@domain/entities';

export abstract class RegisterDatasource {
  abstract getAll(page: number, limit: number): Promise<RegisterPagination>;

  abstract getById(
    id: string
  ): Promise<{ ok: boolean; register: RegisterEntity }>;

  abstract getByParam(
    searchParam: Partial<Pick<IRegister, keyof IRegister>>
  ): Promise<{ ok: boolean; register: RegisterEntity | null }>;

  abstract create(
    createRegisterDto: CreateRegisterDto
  ): Promise<{ ok: boolean; register: RegisterEntity }>;

  abstract update(
    updaterRegisterDto: UpdateRegisterDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
