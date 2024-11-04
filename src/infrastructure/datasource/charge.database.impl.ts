import { Charge } from '@prisma/client';
import { ChargeDatasource } from '@domain/datasources';
import { CustomError } from '@domain/error';
import {
  ICharge,
  ChargePagination,
  IChargeFilterDto,
} from '@domain/interfaces';
import {
  CreateChargeDto,
  UpdateChargeDto,
  FilterChargeDto,
} from '@domain/dtos';

import { prisma } from '@src/data/postgres';
import { LoggerService } from '@presentation/services';
import { cleanObject, HandleDate, pagination } from '@src/utils';

export class ChargeDatasourceImpl extends ChargeDatasource {
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

  private transformObject(entity: Charge): ICharge {
    return {
      ...entity,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  async getById(id: string): Promise<{ ok: boolean; charge: ICharge }> {
    try {
      const charge = await prisma.charge.findUnique({ where: { id } });

      if (!charge) {
        throw CustomError.notFound(`charge with id: ${id} not found`);
      }

      return { ok: true, charge: this.transformObject(charge) };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByParams(
    page: number,
    limit: number,
    searchParam: FilterChargeDto
  ): Promise<ChargePagination> {
    try {
      const where: IChargeFilterDto = cleanObject(searchParam);
      if (searchParam.createdAt)
        where.createdAt = {
          gte: searchParam.createdAt,
          lt: HandleDate.nextDay(searchParam.createdAt),
        };

      const [totalDB, chargesDb] = await Promise.all([
        prisma.charge.count({ where }),
        prisma.charge.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const charges = chargesDb.map((charge) => this.transformObject(charge));
      const total = chargesDb.length === 0 ? 0 : totalDB;
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'charge/get-by-params',
      });

      return { page, limit, total, next, prev, charges };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAll(page: number, limit: number): Promise<ChargePagination> {
    try {
      const [total, chargesDb] = await Promise.all([
        prisma.charge.count(),
        prisma.charge.findMany({ skip: (page - 1) * limit, take: limit }),
      ]);

      const charges = chargesDb.map((charge) => this.transformObject(charge));
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'charge',
      });

      return { page, limit, total, next, prev, charges };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async create(
    createChargeDto: CreateChargeDto
  ): Promise<{ ok: boolean; charge: ICharge }> {
    try {
      const register = await prisma.register.findUnique({
        where: { id: createChargeDto.registerId },
      });

      if (!register) {
        throw CustomError.notFound(
          `register with id: ${createChargeDto.registerId} not found`
        );
      }

      const newCharge = await prisma.charge.create({
        data: createChargeDto,
      });

      return { ok: true, charge: this.transformObject(newCharge) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async update(
    updateChargeDto: UpdateChargeDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updateChargeDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.charge.update({ where: { id }, data });

      return { ok: true, message: 'charge updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    try {
      await this.getById(id);
      await prisma.charge.delete({ where: { id } });
      return { ok: true, message: 'charge deleted successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
