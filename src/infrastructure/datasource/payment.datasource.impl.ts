import { Payment } from '@prisma/client';
import { prisma } from '@src/data/postgres';
import { CustomError } from '@domain/error';
import { cleanObject, HandleDate, pagination } from '@src/utils';
import {
  IPayment,
  IPaymentFilterDto,
  PaymentPagination,
} from '@domain/interfaces';
import { LoggerService } from '@presentation/services';
import { PaymentDatasource } from '@domain/datasources';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDto,
} from '@domain/dtos';

export class PaymentDatasourceImpl extends PaymentDatasource {
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

  private transformObject(entity: Payment): IPayment {
    return { ...entity, paidAt: entity.paidAt.toISOString() };
  }

  async getById(id: string): Promise<{ ok: boolean; payment: IPayment }> {
    try {
      const payment = await prisma.payment.findUnique({ where: { id } });

      if (!payment) {
        throw CustomError.notFound(`payment with id: ${id} not found`);
      }

      return { ok: true, payment: this.transformObject(payment) };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByParams(
    page: number,
    limit: number,
    searchParam: FilterPaymentDto
  ): Promise<PaymentPagination> {
    try {
      const where: IPaymentFilterDto = cleanObject(searchParam);

      if (searchParam.paidAt)
        where.paidAt = {
          gte: searchParam.paidAt,
          lt: HandleDate.nextDay(searchParam.paidAt),
        };

      const [totalDB, paymentsDb] = await Promise.all([
        prisma.payment.count({ where }),
        prisma.payment.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const payments = paymentsDb.map((payment) =>
        this.transformObject(payment)
      );
      const total = paymentsDb.length === 0 ? 0 : totalDB;
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'payment/get-by-params',
      });

      return { page, limit, total, next, prev, payments };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAll(page: number, limit: number): Promise<PaymentPagination> {
    try {
      const [total, paymentsDb] = await Promise.all([
        prisma.payment.count(),
        prisma.payment.findMany({ skip: (page - 1) * limit, take: limit }),
      ]);

      const payments = paymentsDb.map((pay) => this.transformObject(pay));
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'payment',
      });

      return { page, limit, total, next, prev, payments };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async create(
    createPaymentDto: CreatePaymentDto
  ): Promise<{ ok: boolean; payment: IPayment }> {
    const { registerId, ...rest } = createPaymentDto;

    try {
      const newPayment = await prisma.$transaction(async (tx) => {
        const register = await tx.register.findUnique({
          where: { id: registerId },
        });

        if (!register) {
          throw CustomError.notFound(
            `register with id: ${registerId} not found`
          );
        }

        return await tx.payment.create({ data: { ...rest, registerId } });
      });

      return { ok: true, payment: this.transformObject(newPayment) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async update(
    updatePaymentDto: UpdatePaymentDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updatePaymentDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.payment.update({ where: { id }, data });

      return { ok: true, message: 'payment updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    try {
      await this.getById(id);
      await prisma.payment.delete({ where: { id } });
      return { ok: true, message: 'payment deleted successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
