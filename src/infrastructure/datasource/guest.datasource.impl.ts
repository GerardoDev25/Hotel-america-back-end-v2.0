import {
  CreateGuestDto,
  FilterGuestDto,
  UpdateGuestDto,
} from '@domain/dtos/guest';
import { CustomError } from '@domain/error';
import { GuestDatasource } from '@domain/datasources';
import { GuestEntity } from '@domain/entities';
import { GuestPagination, IGuestFilterDto } from '@domain/interfaces';
import { LoggerService } from '@presentation/services';
import { Guest } from '@prisma/client';
import { prisma } from '@src/data/postgres';
import { cleanObject, HandleDate, pagination } from '@src/utils';

export class GuestDatasourceImpl extends GuestDatasource {
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

  private transformObject(entity: Guest): GuestEntity {
    return GuestEntity.fromObject({
      ...entity,
      checkIn: entity.checkIn.toISOString(),
      dateOfBirth: entity.dateOfBirth.toISOString(),
      checkOut: entity.checkOut?.toISOString() ?? null,
    });
  }

  async getById(id: string): Promise<{ ok: boolean; guest: GuestEntity }> {
    try {
      const guest = await prisma.guest.findUnique({ where: { id } });

      if (!guest) {
        throw CustomError.notFound(`guest with id: ${id} not found`);
      }

      return { ok: true, guest: this.transformObject(guest) };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByParams(
    page: number,
    limit: number,
    searchParam: FilterGuestDto
  ): Promise<GuestPagination> {
    try {
      const where: IGuestFilterDto = cleanObject(searchParam);

      if (searchParam.checkIn)
        where.checkIn = {
          gte: searchParam.checkIn,
          lt: HandleDate.nextDay(searchParam.checkIn),
        };

      if (searchParam.checkOut)
        where.checkOut = {
          gte: searchParam.checkOut,
          lt: HandleDate.nextDay(searchParam.checkOut),
        };

      if (searchParam.dateOfBirth)
        where.dateOfBirth = {
          gte: searchParam.dateOfBirth,
          lt: HandleDate.nextDay(searchParam.dateOfBirth),
        };

      const [totalDB, guestsDb] = await Promise.all([
        prisma.guest.count({ where }),
        prisma.guest.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
        }),
      ]);

      const guests = guestsDb.map((guest) => this.transformObject(guest));
      const total = guestsDb.length === 0 ? 0 : totalDB;
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'guest/get-by-params',
      });

      return { page, limit, total, next, prev, guests };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async getAll(page: number, limit: number): Promise<GuestPagination> {
    try {
      const [total, guestsDb] = await Promise.all([
        prisma.guest.count(),
        prisma.guest.findMany({ skip: (page - 1) * limit, take: limit }),
      ]);

      const guests = guestsDb.map((guest) => this.transformObject(guest));
      const { next, prev } = pagination({ page, limit, total, path: 'guest' });

      return { page, limit, total, next, prev, guests };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async create(
    createGuestDto: CreateGuestDto
  ): Promise<{ ok: boolean; guest: GuestEntity }> {
    const { registerId, ...rest } = createGuestDto;

    if (!registerId) {
      throw CustomError.badRequest('registerId property required');
    }

    try {
      const register = await prisma.register.findFirst({
        where: { id: registerId },
      });

      if (!register) {
        throw CustomError.notFound(`register with id: ${registerId} not found`);
      }
    } catch (error) {
      throw this.handleError(error);
    }

    try {
      const newGuest = await prisma.$transaction(async (tx) => {
        await tx.register.update({
          where: { id: createGuestDto.registerId },
          data: { guestsNumber: { increment: 1 } },
        });
        return await tx.guest.create({ data: { ...rest, registerId } });
      });

      return { ok: true, guest: this.transformObject(newGuest) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async update(
    updateGuestDto: UpdateGuestDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updateGuestDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.guest.update({ where: { id }, data });

      return { ok: true, message: 'guest updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    try {
      const { guest } = await this.getById(id);

      return await prisma.$transaction(async (tx) => {
        const registerUpdated = await tx.register.update({
          where: { id: guest.registerId },
          data: { guestsNumber: { decrement: 1 } },
        });

        if (registerUpdated.guestsNumber < 1) {
          throw CustomError.conflict('register most have 1 guest as minimum');
        }

        await tx.guest.delete({ where: { id } });
        return { ok: true, message: 'guest deleted successfully' };
      });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
