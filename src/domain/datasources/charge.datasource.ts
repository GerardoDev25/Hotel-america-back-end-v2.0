import { CreateChargeDto, UpdateChargeDto } from '@domain/dtos/charge';
import { ChargePagination, ChargeFilter } from '@domain/interfaces';
import { ChargeEntity } from '@domain/entities';

export abstract class ChargeDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; charge: ChargeEntity }>;

  abstract getByParam(
    searchParam: ChargeFilter
  ): Promise<{ ok: boolean; charge: ChargeEntity | null }>;

  abstract getAll(page: number, limit: number): Promise<ChargePagination>;

  abstract create(
    createChargeDto: CreateChargeDto
  ): Promise<{ ok: boolean; charge: ChargeEntity }>;

  abstract update(
    updateChargeDto: UpdateChargeDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
