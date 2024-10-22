import { CustomError } from '@domain/error';
import { CafeteriaDatasource } from '@domain/datasources';
import { UpdateCafeteriaDto } from '@domain/dtos/cafeteria';
import { CafeteriaItem, CafeteriaList } from '@domain/interfaces';

import { HandleDate } from '@src/utils';
import { prisma } from '@src/data/postgres';
import { LoggerService } from '@presentation/services';

export class CafeteriaDatasourceImpl extends CafeteriaDatasource {
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

  private async getById(id: string) {
    try {
      const record = await prisma.cafeteria.findUnique({ where: { id } });

      if (!record) {
        throw CustomError.notFound(`record with id: ${id} not found`);
      }

      return { ok: true, record };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAll(): Promise<CafeteriaList> {
    const today = new Date();
    try {
      const cafeteriaListDB = await prisma.cafeteria.findMany({
        where: { createdAt: { gte: today, lt: HandleDate.nextDay(today) } },
        select: {
          id: true,
          guestId: true,
          isServed: true,
          guest: {
            select: {
              name: true,
              lastName: true,
              register: { select: { room: { select: { roomNumber: true } } } },
            },
          },
        },
      });

      const cafeteriaList: CafeteriaItem[] = cafeteriaListDB.map(
        (cafeteria) => ({
          id: cafeteria.id,
          guestName: `${cafeteria.guest.name} ${cafeteria.guest.lastName}`,
          guestId: cafeteria.guestId,
          isServed: cafeteria.isServed,
          roomNumber: cafeteria.guest.register.room.roomNumber,
        })
      );

      return { ok: true, items: cafeteriaList };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async update(
    updateCafeteriaDto: UpdateCafeteriaDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, isServed } = updateCafeteriaDto;

    await this.getById(id);

    try {
      await prisma.cafeteria.update({ where: { id }, data: { isServed } });

      return { ok: true, message: 'record updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
