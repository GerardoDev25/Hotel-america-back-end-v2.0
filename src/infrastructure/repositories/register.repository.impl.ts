import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { RegisterDatasource } from '@domain/datasources';
import { RegisterEntity } from '@domain/entities';
import { RegisterPagination, IRegister } from '@domain/interfaces';
import { RegisterRepository } from '@domain/repositories';

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

  getByParam(
    searchParam: Partial<Pick<IRegister, keyof IRegister>>
  ): Promise<{ ok: boolean; register: RegisterEntity | null }> {
    return this.registerDataSource.getByParam(searchParam);
  }

  create(
    createRegisterDto: CreateRegisterDto
  ): Promise<{ ok: boolean; register: RegisterEntity }> {
    return this.registerDataSource.create(createRegisterDto);
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
