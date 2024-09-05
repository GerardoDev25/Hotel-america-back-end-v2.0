import { CreateUserDto, UpdateUserDto } from '../dtos/user';
import { UserEntity } from '../entities';
import { UserPagination } from '../interfaces';

export abstract class UserDatasource {
  abstract getAll(page: number, limit: number): Promise<UserPagination>;

  abstract getAllActive(
    page: number,
    limit: number,
    isActive: boolean
  ): Promise<UserPagination>;

  abstract getById(id: string): Promise<{ ok: boolean; user: UserEntity }>;

  abstract create(
    createUserDto: CreateUserDto
  ): Promise<{ ok: boolean; user: UserEntity }>;

  abstract update(
    updateUserDto: UpdateUserDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
