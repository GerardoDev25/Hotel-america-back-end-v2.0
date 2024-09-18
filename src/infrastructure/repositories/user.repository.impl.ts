import { UserDatasource } from '../../domain/datasources';
import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { UserEntity } from '../../domain/entities';
import { IUser, UserPagination } from '../../domain/interfaces';
import { UserRepository } from '../../domain/repositories';

export class UserRepositoryImpl extends UserRepository {
  constructor(private readonly userDataSource: UserDatasource) {
    super();
  }

  async getById(id: string): Promise<{ ok: boolean; user: UserEntity }> {
    return this.userDataSource.getById(id);
  }

  getByParam(
    searchParam: Partial<Pick<IUser, keyof IUser>>
  ): Promise<{ ok: boolean; user: UserEntity | null }> {
    return this.userDataSource.getByParam(searchParam);
  }

  getAll(
    page: number,
    limit: number,
    isActive?: boolean
  ): Promise<UserPagination> {
    return isActive === undefined
      ? this.userDataSource.getAll(page, limit)
      : this.userDataSource.getAllActive(page, limit, isActive);
  }

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ ok: boolean; user: UserEntity }> {
    return this.userDataSource.create(createUserDto);
  }

  async update(
    updateUserDto: UpdateUserDto
  ): Promise<{ ok: boolean; message: string }> {
    return this.userDataSource.update(updateUserDto);
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    return this.userDataSource.delete(id);
  }
}
