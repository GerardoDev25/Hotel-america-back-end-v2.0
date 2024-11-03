import {
  PaginationDto,
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDto,
} from '@domain/dtos';
import { PaymentDatasource } from '@domain/datasources';

export class PaymentService {
  constructor(private readonly paymentDatasource: PaymentDatasource) {}

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.paymentDatasource.getAll(page, limit);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterPaymentDto: FilterPaymentDto
  ) {
    const { page, limit } = paginationDto;
    return this.paymentDatasource.getByParams(page, limit, filterPaymentDto);
  }

  async getById(id: string) {
    return this.paymentDatasource.getById(id);
  }

  async create(createPaymentDto: CreatePaymentDto) {
    return this.paymentDatasource.create(createPaymentDto);
  }

  async update(updatePaymentDto: UpdatePaymentDto) {
    return this.paymentDatasource.update(updatePaymentDto);
  }

  async delete(id: string) {
    return this.paymentDatasource.delete(id);
  }
}
