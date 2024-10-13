import { CreatePaymentDto, UpdatePaymentDto } from '@domain/dtos/payment';
import { PaymentFilter, PaymentPagination } from '@domain/interfaces';
import { PaymentEntity } from '@domain/entities';

export abstract class PaymentRepository {
  abstract getById(
    id: string
  ): Promise<{ ok: boolean; payment: PaymentEntity }>;

  abstract getByParam(
    searchParam: PaymentFilter
  ): Promise<{ ok: boolean; payment: PaymentEntity | null }>;

  abstract getAll(page: number, limit: number): Promise<PaymentPagination>;

  abstract create(
    createPaymentDto: CreatePaymentDto
  ): Promise<{ ok: boolean; payment: PaymentEntity }>;

  abstract update(
    updatePaymentDto: UpdatePaymentDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
