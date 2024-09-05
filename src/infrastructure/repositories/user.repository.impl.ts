import { UserDatasource } from '../../domain/datasources';
import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { UserEntity } from '../../domain/entities';
import { UserPagination } from '../../domain/interfaces';
import { UserRepository } from '../../domain/repositories';

export class UserRepositoryImpl extends UserRepository {
  constructor(private readonly userDataSource: UserDatasource) {
    super();
  }

  getAll(
    page: number,
    limit: number,
    isActive?: boolean
  ): Promise<UserPagination> {
    if (isActive === undefined) {
      return this.userDataSource.getAll(page, limit);
    }
    return this.userDataSource.getAllActive(page, limit, isActive);
  }

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ ok: boolean; user: UserEntity }> {
    return this.userDataSource.create(createUserDto);
  }

  async getById(id: string): Promise<{ ok: boolean; user: UserEntity }> {
    return this.userDataSource.getById(id);
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
