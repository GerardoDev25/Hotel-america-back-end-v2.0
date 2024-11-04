import { CreateUserDto, UpdateUserDto } from '@domain/dtos';
import { IUserFilterDto, UserPagination, IUser } from '@domain/interfaces';

export abstract class UserDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; user: IUser }>;

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
  ): Promise<{ ok: boolean; user: IUser }>;

  abstract update(
    updateUserDto: UpdateUserDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
