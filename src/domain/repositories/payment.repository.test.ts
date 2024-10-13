/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreatePaymentDto, UpdatePaymentDto } from '@domain/dtos/payment';
import { PaymentEntity } from '@domain/entities';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { PaymentRepository } from '.';
import {
  PaymentFilter,
  PaymentPagination,
  PaymentTypeList,
} from '@domain/interfaces';

describe('payment.repository.ts', () => {
  const page = 2;
  const limit = 10;

  const mockPayment = new PaymentEntity({
    id: Uuid.v4(),
    amount: 100,
    paidAt: Generator.randomDate(),
    type: PaymentTypeList.BACK,
    registerId: Uuid.v4(),
  });

  const pagination: PaymentPagination = {
    payments: [mockPayment],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  class MockPaymentRepository extends PaymentRepository {
    async getById(
      id: string
    ): Promise<{ ok: boolean; payment: PaymentEntity }> {
      return { ok: true, payment: mockPayment };
    }

    async getByParam(
      searchParam: PaymentFilter
    ): Promise<{ ok: boolean; payment: PaymentEntity | null }> {
      return { ok: true, payment: mockPayment };
    }

    async getAll(page: number, limit: number): Promise<PaymentPagination> {
      return pagination;
    }

    async create(
      createPaymentDto: CreatePaymentDto
    ): Promise<{ ok: boolean; payment: PaymentEntity }> {
      return { ok: true, payment: mockPayment };
    }

    async update(
      updatePaymentDto: UpdatePaymentDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }
  }

  const mockPaymentRepository = new MockPaymentRepository();

  test('should call method (getById)', async () => {
    const { ok, payment } = await mockPaymentRepository.getById(mockPayment.id);
    expect(ok).toBeTruthy();
    expect(payment).toEqual(mockPayment);
  });

  test('should call method (getByParam)', async () => {
    const { ok, payment } = await mockPaymentRepository.getByParam({
      id: mockPayment.id,
    });
    expect(ok).toBeTruthy();
    expect(payment).toEqual(mockPayment);
  });

  test('should call method (getAll)', async () => {
    const result = await mockPaymentRepository.getAll(page, limit);
    expect(result).toEqual(pagination);
  });

  test('should call method (create)', async () => {
    const { ok, payment } = await mockPaymentRepository.create({
      amount: mockPayment.amount,
      type: mockPayment.type,
      registerId: mockPayment.registerId,
    });
    expect(ok).toBeTruthy();
    expect(payment).toEqual(mockPayment);
  });

  test('should call method (update)', async () => {
    const { ok, message } = await mockPaymentRepository.update({
      id: mockPayment.id,
      amount: mockPayment.amount,
      type: mockPayment.type,
    });
    expect(ok).toBeTruthy();
    expect(message).toEqual('');
  });

  test('should call method (delete)', async () => {
    const { ok, message } = await mockPaymentRepository.delete(mockPayment.id);
    expect(ok).toBeTruthy();
    expect(message).toEqual('');
  });
});
