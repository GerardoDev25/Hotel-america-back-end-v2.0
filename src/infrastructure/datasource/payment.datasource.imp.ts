import { Payment } from '@prisma/client';
import { prisma } from '@src/data/postgres';
import { PaymentDatasource } from '@src/domain/datasources';
import { CreatePaymentDto, UpdatePaymentDto } from '@src/domain/dtos/payment';
import { PaymentEntity } from '@src/domain/entities';
import { CustomError } from '@src/domain/error';
import { IPayment, PaymentPagination } from '@src/domain/interfaces';
import { LoggerService } from '@src/presentation/services';
import { cleanObject, pagination } from '@src/utils';

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

  private transformObject(entity: Payment): PaymentEntity {
    return PaymentEntity.fromObject({
      ...entity,
      paidAt: entity.paidAt.toISOString(),
    });
  }

  async getById(id: string): Promise<{ ok: boolean; payment: PaymentEntity }> {
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

  async getByParam(
    searchParam: Partial<Pick<IPayment, keyof IPayment>>
  ): Promise<{ ok: boolean; payment: PaymentEntity | null }> {
    try {
      const payment = await prisma.payment.findFirst({ where: searchParam });
      if (!payment) return { ok: false, payment: null };

      return { ok: true, payment: this.transformObject(payment) };
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
  ): Promise<{ ok: boolean; payment: PaymentEntity }> {
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
