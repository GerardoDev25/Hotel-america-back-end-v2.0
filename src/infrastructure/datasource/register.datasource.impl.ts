import { RegisterEntity } from '../../domain/entities';
import { LoggerService } from '../../presentation/services';
import { RegisterDatasource } from '../../domain/datasources';
import { RegisterPagination, IRegister } from '../../domain/interfaces';
import {
  CreateRegisterDto,
  UpdateRegisterDto,
} from '../../domain/dtos/register';
import { CustomError } from '../../domain/error';
import { prisma } from '../../data/postgres';
import { cleanObject, pagination } from '../../utils';

export class RegisterDatasourceImpl extends RegisterDatasource {
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

  async getById(
    id: string
  ): Promise<{ ok: boolean; register: RegisterEntity }> {
    try {
      const register = await prisma.register.findUnique({ where: { id } });

      if (!register) {
        throw CustomError.notFound(`register with id ${id} not found`);
      }

      return {
        ok: true,
        register: RegisterEntity.fromObject({
          ...register,
          checkIn: register.checkIn.toISOString(),
          checkOut: register.checkOut?.toISOString() ?? null,
        }),
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getByParam(
    searchParam: Partial<Pick<IRegister, keyof IRegister>>
  ): Promise<{ ok: boolean; register: RegisterEntity | null }> {
    try {
      const register = await prisma.register.findFirst({ where: searchParam });

      if (!register) {
        return { ok: true, register: null };
      }

      return {
        ok: true,
        register: RegisterEntity.fromObject({
          ...register,
          checkIn: register.checkIn.toISOString(),
          checkOut: register.checkOut?.toISOString() ?? null,
        }),
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAll(page: number, limit: number): Promise<RegisterPagination> {
    try {
      const [total, registersDb] = await Promise.all([
        prisma.register.count(),
        prisma.register.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const registers = registersDb.map((register) =>
        RegisterEntity.fromObject({
          ...register,
          checkIn: register.checkIn.toISOString(),
          checkOut: register.checkOut?.toISOString() ?? null,
        })
      );

      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'register',
      });
      return { page, limit, total, next, prev, registers };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    createRegisterDto: CreateRegisterDto
  ): Promise<{ ok: boolean; register: RegisterEntity }> {
    try {
      const newRegister = await prisma.register.create({
        data: createRegisterDto,
      });

      return {
        ok: true,
        register: RegisterEntity.fromObject({
          ...newRegister,
          checkIn: newRegister.checkIn.toISOString(),
          checkOut: newRegister.checkOut?.toISOString() ?? null,
        }),
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async update(
    updaterRegisterDto: UpdateRegisterDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updaterRegisterDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.register.update({ where: { id }, data });
      return { ok: true, message: 'register updated successfully' };
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        this.logger.error(error.message);
        throw CustomError.internalServerError(`internal server error`);
      }
    }
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    await this.getById(id);

    try {
      await prisma.register.delete({ where: { id } });

      return { ok: true, message: 'register deleted successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
