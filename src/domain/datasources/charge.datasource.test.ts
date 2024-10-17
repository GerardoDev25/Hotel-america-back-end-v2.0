/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChargeEntity } from '@domain/entities';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { ChargePagination, ChargeTypeList } from '@domain/interfaces';
import {
  CreateChargeDto,
  UpdateChargeDto,
  FilterChargeDto,
} from '@domain/dtos/charge';
import { ChargeDatasource } from '.';

describe('charge.datasource.ts', () => {
  const page = 2;
  const limit = 10;

  const mockCharge = new ChargeEntity({
    id: Uuid.v4(),
    amount: 100,
    createdAt: Generator.randomDate(),
    type: ChargeTypeList.CAFETERIA,
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

  class MockChargeDatasource extends ChargeDatasource {
    async getById(id: string): Promise<{ ok: boolean; charge: ChargeEntity }> {
      return { ok: true, charge: mockCharge };
    }

    async getByParams(
      page: number,
      limit: number,
      searchParam: FilterChargeDto
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

  const mockChargeDatasource = new MockChargeDatasource();

  test('should call method (getById)', async () => {
    const { ok, charge } = await mockChargeDatasource.getById(mockCharge.id);
    expect(ok).toBeTruthy();
    expect(charge).toEqual(mockCharge);
  });

  test('should call method (getByParams)', async () => {
    const result = await mockChargeDatasource.getByParams(page, limit, {
      amount: mockCharge.amount,
    });
    expect(result).toEqual(pagination);
  });

  test('should call method (getAll)', async () => {
    const result = await mockChargeDatasource.getAll(page, limit);
    expect(result).toEqual(pagination);
  });

  test('should call method (create)', async () => {
    const { ok, charge } = await mockChargeDatasource.create({
      amount: mockCharge.amount,
      type: mockCharge.type,
      registerId: mockCharge.registerId,
    });
    expect(ok).toBeTruthy();
    expect(charge).toEqual(mockCharge);
  });

  test('should call method (update)', async () => {
    const { ok, message } = await mockChargeDatasource.update({
      id: mockCharge.id,
      amount: mockCharge.amount,
      type: mockCharge.type,
    });
    expect(ok).toBeTruthy();
    expect(message).toEqual('');
  });

  test('should call method (delete)', async () => {
    const { ok, message } = await mockChargeDatasource.delete(mockCharge.id);
    expect(ok).toBeTruthy();
    expect(message).toEqual('');
  });
});
