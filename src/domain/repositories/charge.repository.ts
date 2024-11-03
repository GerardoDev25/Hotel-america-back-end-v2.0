import { CreateChargeDto, UpdateChargeDto } from '@domain/dtos';
import { ChargePagination, IChargeFilterDto } from '@domain/interfaces';
import { ChargeEntity } from '@domain/entities';

export abstract class ChargeRepository {
  abstract getById(id: string): Promise<{ ok: boolean; charge: ChargeEntity }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: IChargeFilterDto
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
