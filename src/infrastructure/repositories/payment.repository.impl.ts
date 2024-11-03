import { PaymentEntity } from '@domain/entities';
import { PaymentPagination } from '@domain/interfaces';
import { PaymentDatasource } from '@domain/datasources';
import { PaymentRepository } from '@domain/repositories';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDto,
} from '@domain/dtos';

export class PaymentRepositoryImpl extends PaymentRepository {
  constructor(private readonly paymentDatasource: PaymentDatasource) {
    super();
  }

  getById(id: string): Promise<{ ok: boolean; payment: PaymentEntity }> {
    return this.paymentDatasource.getById(id);
  }

  getByParams(
    page: number,
    limit: number,
    searchParam: FilterPaymentDto
  ): Promise<PaymentPagination> {
    return this.paymentDatasource.getByParams(page, limit, searchParam);
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
