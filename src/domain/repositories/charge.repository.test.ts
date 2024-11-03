/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateChargeDto, UpdateChargeDto } from '@domain/dtos';
import { ChargeEntity } from '@domain/entities';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { ChargePagination, IChargeFilterDto } from '@domain/interfaces';
import { ChargeRepository } from '.';

describe('charge.repository.ts', () => {
  const page = 2;
  const limit = 10;

  const mockCharge = new ChargeEntity({
    id: Uuid.v4(),
    amount: 100,
    createdAt: Generator.randomDate(),
    type: 'laundry',
    registerId: Uuid.v4(),
  });

  const pagination: ChargePagination = {
    charges: [mockCharge],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  class MockChargeRepository extends ChargeRepository {
    async getById(id: string): Promise<{ ok: boolean; charge: ChargeEntity }> {
      return { ok: true, charge: mockCharge };
    }

    async getByParams(
      page: number,
      limit: number,
      searchParam: IChargeFilterDto
    ): Promise<ChargePagination> {
      return pagination;
    }

    async getAll(page: number, limit: number): Promise<ChargePagination> {
      return pagination;
    }

    async create(
      createChargeDto: CreateChargeDto
    ): Promise<{ ok: boolean; charge: ChargeEntity }> {
      return { ok: true, charge: mockCharge };
    }

    async update(
      updateChargeDto: UpdateChargeDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }
  }

  const mockChargeRepository = new MockChargeRepository();

  test('should call method (getById)', async () => {
    const { ok, charge } = await mockChargeRepository.getById(mockCharge.id);
    expect(ok).toBeTruthy();
    expect(charge).toEqual(mockCharge);
  });

  test('should call method (getByParams)', async () => {
    const result = await mockChargeRepository.getByParams(page, limit, {
      amount: mockCharge.amount,
    });
    expect(result).toEqual(pagination);
  });

  test('should call method (getAll)', async () => {
    const result = await mockChargeRepository.getAll(page, limit);
    expect(result).toEqual(pagination);
  });

  test('should call method (create)', async () => {
    const { ok, charge } = await mockChargeRepository.create({
      amount: mockCharge.amount,
      type: mockCharge.type,
      registerId: mockCharge.registerId,
    });
    expect(ok).toBeTruthy();
    expect(charge).toEqual(mockCharge);
  });

  test('should call method (update)', async () => {
    const { ok, message } = await mockChargeRepository.update({
      id: mockCharge.id,
      amount: mockCharge.amount,
      type: mockCharge.type,
    });
    expect(ok).toBeTruthy();
    expect(message).toEqual('');
  });

  test('should call method (delete)', async () => {
    const { ok, message } = await mockChargeRepository.delete(mockCharge.id);
    expect(ok).toBeTruthy();
    expect(message).toEqual('');
  });
});
