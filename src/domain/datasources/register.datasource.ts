import { CreateRegisterDto, UpdateRegisterDto } from '../dtos/register';
import { RegisterEntity } from '../entities/register.entity';
import { IRegister, RegisterPagination } from '../interfaces';

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
