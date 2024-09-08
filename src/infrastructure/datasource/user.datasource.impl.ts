import { prisma } from '../../data/postgres';
import { UserDatasource } from '../../domain/datasources';
import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { UserEntity } from '../../domain/entities';
import { CustomError } from '../../domain/error';
import { IUser, UserPagination } from '../../domain/interfaces';
import { LoggerService } from '../../presentation/services';
import { cleanObject, pagination } from '../../utils';

export class UserDatasourceImpl extends UserDatasource {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  async getById(id: string): Promise<{ ok: boolean; user: UserEntity }> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw CustomError.notFound(`user with id: ${id} not found`);
      }

      return { ok: true, user: UserEntity.fromObject(user) };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async getByParam(
    searchParam: Partial<Pick<IUser, keyof IUser>>
  ): Promise<{ ok: boolean; user: UserEntity | null }> {
    try {
      const user = await prisma.user.findFirst({ where: searchParam });
      if (!user) return { ok: false, user: null };
      return { ok: true, user: UserEntity.fromObject(user) };
    } catch (error: any) {
      this.logger.error(error.message);
      throw CustomError.internalServerError(`internal server error`);
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

      const users = usersDb.map((user) => UserEntity.fromObject(user));
      const { next, prev } = pagination({ page, limit, total, path: 'user' });

      return { page, limit, total, next, prev, users };
    } catch (error: any) {
      this.logger.error(error.message);
      throw CustomError.internalServerError(`internal server error`);
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

      const users = usersDb.map((user) => UserEntity.fromObject(user));
      const { next, prev } = pagination({ page, limit, total, path: 'user' });

      return { page, limit, total, next, prev, users };
    } catch (error: any) {
      this.logger.error(error.message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async create(
    createUserDto: CreateUserDto
  ): Promise<{ ok: boolean; user: UserEntity }> {
    try {
      const newUser = await prisma.user.create({ data: createUserDto });

      return { ok: true, user: UserEntity.fromObject(newUser) };
    } catch (error: any) {
      this.logger.error(error.message);
      throw CustomError.internalServerError(`internal server error`);
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
      this.logger.error(error.message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    await this.getById(id);

    try {
      await prisma.user.delete({ where: { id } });

      return { ok: true, message: 'user deleted successfully' };
    } catch (error: any) {
      this.logger.error(error.message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }
}
