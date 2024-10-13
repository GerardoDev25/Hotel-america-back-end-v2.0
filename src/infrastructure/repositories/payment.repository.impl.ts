import { CreatePaymentDto, UpdatePaymentDto } from '@domain/dtos/payment';
import { PaymentFilter, PaymentPagination } from '@domain/interfaces';
import { PaymentDatasource } from '@domain/datasources';
import { PaymentEntity } from '@domain/entities';
import { PaymentRepository } from '@domain/repositories';

export class PaymentRepositoryImpl extends PaymentRepository {
  constructor(private readonly paymentDatasource: PaymentDatasource) {
    super();
  }

  getById(id: string): Promise<{ ok: boolean; payment: PaymentEntity }> {
    return this.paymentDatasource.getById(id);
  }

  getByParam(
    searchParam: PaymentFilter
  ): Promise<{ ok: boolean; payment: PaymentEntity | null }> {
    return this.paymentDatasource.getByParam(searchParam);
  }

  getAll(page: number, limit: number): Promise<PaymentPagination> {
    return this.paymentDatasource.getAll(page, limit);
  }

  create(
    createPaymentDto: CreatePaymentDto
  ): Promise<{ ok: boolean; payment: PaymentEntity }> {
    return this.paymentDatasource.create(createPaymentDto);
  }

  update(
    updatePaymentDto: UpdatePaymentDto
  ): Promise<{ ok: boolean; message: string }> {
    return this.paymentDatasource.update(updatePaymentDto);
  }

  delete(id: string): Promise<{ ok: boolean; message: string }> {
    return this.paymentDatasource.delete(id);
  }
}
