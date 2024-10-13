import { User } from '@prisma/client';

import { CreateUserDto, UpdateUserDto } from '@domain/dtos/user';
import { CustomError } from '@domain/error';
import { UserFilter, UserPagination } from '@domain/interfaces';
import { UserDatasource } from '@domain/datasources';
import { UserEntity } from '@domain/entities';

import { LoggerService } from '@presentation/services';

import { cleanObject, pagination } from '@src/utils';
import { prisma } from '@src/data/postgres';

export class UserDatasourceImpl extends UserDatasource {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  private handleError(error: any) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      this.logger.error((error as Error).message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  private transformObject(entity: User): UserEntity {
    return UserEntity.fromObject({
      ...entity,
      birdDate: entity.birdDate.toISOString(),
    });
  }

  async getById(id: string): Promise<{ ok: boolean; user: UserEntity }> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw CustomError.notFound(`user with id: ${id} not found`);
      }

      return { ok: true, user: this.transformObject(user) };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByParam(
    searchParam: UserFilter
  ): Promise<{ ok: boolean; user: UserEntity | null }> {
    try {
      const user = await prisma.user.findFirst({ where: searchParam });
      if (!user) return { ok: false, user: null };

      return { ok: true, user: this.transformObject(user) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAll(page: number, limit: number): Promise<UserPagination> {
    try {
      const [total, usersDb] = await Promise.all([
        prisma.user.count(),
        prisma.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const users = usersDb.map((user) => this.transformObject(user));
      const { next, prev } = pagination({ page, limit, total, path: 'user' });

      return { page, limit, total, next, prev, users };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAllActive(
    page: number,
    limit: number,
    isActive: boolean
  ): Promise<UserPagination> {
    try {
      const [total, usersDb] = await Promise.all([
        prisma.user.count({ where: { isActive } }),

        prisma.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: { isActive },
        }),
      ]);

      const users = usersDb.map((user) => this.transformObject(user));
      const { next, prev } = pagination({ page, limit, total, path: 'user' });

      return { page, limit, total, next, prev, users };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ ok: boolean; user: UserEntity }> {
    try {
      const newUser = await prisma.user.create({ data: createUserDto });

      return { ok: true, user: this.transformObject(newUser) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async update(
    updateUserDto: UpdateUserDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updateUserDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.user.update({ where: { id }, data });
      return { ok: true, message: 'user updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    await this.getById(id);

    try {
      await prisma.user.delete({ where: { id } });
      return { ok: true, message: 'user deleted successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
