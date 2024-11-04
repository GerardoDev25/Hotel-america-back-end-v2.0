import { ChargePagination, ICharge } from '@domain/interfaces';
import {
  CreateChargeDto,
  UpdateChargeDto,
  FilterChargeDto,
} from '@domain/dtos';

export abstract class ChargeDatasource {
  abstract getById(id: string): Promise<{ ok: boolean; charge: ICharge }>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: FilterChargeDto
  ): Promise<ChargePagination>;

  abstract getAll(page: number, limit: number): Promise<ChargePagination>;

  abstract create(
    createChargeDto: CreateChargeDto
  ): Promise<{ ok: boolean; charge: ICharge }>;

  abstract update(
    updateChargeDto: UpdateChargeDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
