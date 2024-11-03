/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomError } from '@domain/error';
import {
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
  PaginationDto,
} from '@domain/dtos';
import { UserDatasource } from '@domain/datasources';
import { UserPagination } from '@domain/interfaces';

export class UserService {
  constructor(private readonly UserDatasource: UserDatasource) {}

  private handleError(error: unknown) {
    if (error instanceof CustomError) throw error;
    throw CustomError.internalServerError('Internal Server Error');
  }

  async getAll(paginationDto: PaginationDto, isActive?: boolean) {
    const { page, limit } = paginationDto;
    let data: UserPagination;

    try {
      if (isActive !== undefined)
        data = await this.UserDatasource.getAllActive(page, limit, isActive);
      else data = await this.UserDatasource.getAll(page, limit);

      const { users, ...rest } = data;

      const usersMapped = users.map((user) => {
        const { password, ...restUser } = user;
        return restUser;
      });

      return { ...rest, users: usersMapped };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterRoomDto: FilterUserDto
  ) {
    const { page, limit } = paginationDto;
    try {
      const { users, ...rest } = await this.UserDatasource.getByParams(
        page,
        limit,
        filterRoomDto
      );

      const usersMapped = users.map((user) => {
        const { password, ...restUser } = user;
        return restUser;
      });

      return { ...rest, users: usersMapped };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string) {
    try {
      const { ok, user } = await this.UserDatasource.getById(id);
      const { password, ...rest } = user;

      return { ok, user: { ...rest } };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { ok, user } = await this.UserDatasource.create(createUserDto);
      const { password, ...rest } = user;

      return { ok, user: { ...rest } };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.UserDatasource.update(updateUserDto);
  }

  async delete(id: string) {
    return this.UserDatasource.delete(id);
  }
}
