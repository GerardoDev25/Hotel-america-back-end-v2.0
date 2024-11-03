import { CreateUserDto, UpdateUserDto } from '@domain/dtos';
import { IUserFilterDto, UserPagination } from '@domain/interfaces';
import { UserEntity } from '@domain/entities';

export abstract class UserDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; user: UserEntity }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: IUserFilterDto
  ): Promise<UserPagination>;

  abstract getAll(page: number, limit: number): Promise<UserPagination>;

  abstract getAllActive(
    page: number,
    limit: number,
    isActive: boolean
  ): Promise<UserPagination>;

  abstract create(
    createUserDto: CreateUserDto
  ): Promise<{ ok: boolean; user: UserEntity }>;

  abstract update(
    updateUserDto: UpdateUserDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
