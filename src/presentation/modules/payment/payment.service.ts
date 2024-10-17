import { PaginationDto } from '@domain/dtos/share';
import { PaymentRepository } from '@domain/repositories';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  UpdatePaymentDto,
} from '@domain/dtos/payment';

export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.paymentRepository.getAll(page, limit);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterPaymentDto: FilterPaymentDto
  ) {
    const { page, limit } = paginationDto;
    return this.paymentRepository.getByParams(page, limit, filterPaymentDto);
  }

  async getById(id: string) {
    return this.paymentRepository.getById(id);
  }

  async create(createPaymentDto: CreatePaymentDto) {
    return this.paymentRepository.create(createPaymentDto);
  }

  async update(updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepository.update(updatePaymentDto);
  }

  async delete(id: string) {
    return this.paymentRepository.delete(id);
  }
}
