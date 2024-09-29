import { CreateGuestDto, UpdateGuestDto } from '@domain/dtos/guest';
import { CustomError } from '@domain/error';
import { GuestDatasource } from '@domain/datasources';
import { GuestEntity } from '@domain/entities';
import { IGuest, GuestPagination } from '@domain/interfaces';
import { LoggerService } from '@presentation/services';
import { Guest } from '@prisma/client';
import { prisma } from '@src/data/postgres';
import { cleanObject, pagination } from '@src/utils';

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

  async getByParam(
    searchParam: Partial<Pick<IGuest, keyof IGuest>>
  ): Promise<{ ok: boolean; guest: GuestEntity | null }> {
    try {
      const guest = await prisma.guest.findFirst({ where: searchParam });
      if (!guest) return { ok: false, guest: null };

      return { ok: true, guest: this.transformObject(guest) };
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
    try {
      // const newGuest = await prisma.guest.create({ data: createGuestDto });

      const newGuest = await prisma.$transaction(async (tx) => {
        await tx.register.update({
          where: { id: createGuestDto.registerId },
          data: { guestsNumber: { increment: 1 } },
        });
        return await tx.guest.create({ data: createGuestDto });
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
    await this.getById(id);

    try {
      await prisma.guest.delete({ where: { id } });
      return { ok: true, message: 'guest deleted successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
