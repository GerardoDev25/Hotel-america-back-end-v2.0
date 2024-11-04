import { PaymentPagination, IPayment } from '@domain/interfaces';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDto,
} from '@domain/dtos';

export abstract class PaymentDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; payment: IPayment }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: FilterPaymentDto
  ): Promise<PaymentPagination>;

  abstract getAll(page: number, limit: number): Promise<PaymentPagination>;

  abstract create(
    createPaymentDto: CreatePaymentDto
  ): Promise<{ ok: boolean; payment: IPayment }>;

  abstract update(
    updatePaymentDto: UpdatePaymentDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
