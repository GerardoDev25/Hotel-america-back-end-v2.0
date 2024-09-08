import { CreateUserDto, UpdateUserDto } from '../dtos/user';
import { UserEntity } from '../entities';
import { IUser, UserPagination } from '../interfaces';

export abstract class UserRepository {
  abstract getById(id: string): Promise<{ ok: boolean; user: UserEntity }>;

  abstract getByParam(
    searchParam: Partial<Pick<IUser, keyof IUser>>
  ): Promise<{ ok: boolean; user: UserEntity | null }>;

  abstract getAll(
    page: number,
    limit: number,
    isActive?: boolean
  ): Promise<UserPagination>;

  abstract create(
    createUserDto: CreateUserDto
  ): Promise<{ ok: boolean; user: UserEntity }>;

  abstract update(
    updateUserDto: UpdateUserDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
