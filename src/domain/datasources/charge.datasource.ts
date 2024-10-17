import { ChargePagination } from '@domain/interfaces';
import { ChargeEntity } from '@domain/entities';
import {
  CreateChargeDto,
  UpdateChargeDto,
  FilterChargeDto,
} from '@domain/dtos/charge';

export abstract class ChargeDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; charge: ChargeEntity }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: FilterChargeDto
  ): Promise<ChargePagination>;

  abstract getAll(page: number, limit: number): Promise<ChargePagination>;

  abstract create(
    createChargeDto: CreateChargeDto
  ): Promise<{ ok: boolean; charge: ChargeEntity }>;

  abstract update(
    updateChargeDto: UpdateChargeDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
