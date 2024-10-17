import { ChargeEntity } from '@domain/entities';
import { ChargeDatasource } from '@domain/datasources';
import { ChargeRepository } from '@domain/repositories';
import { ChargePagination } from '@domain/interfaces';
import {
  CreateChargeDto,
  FilterChargeDto,
  UpdateChargeDto,
} from '@domain/dtos/charge';

export class ChargeRepositoryImpl extends ChargeRepository {
  constructor(private readonly chargeDatasource: ChargeDatasource) {
    super();
  }

  getById(id: string): Promise<{ ok: boolean; charge: ChargeEntity }> {
    return this.chargeDatasource.getById(id);
  }

  getByParams(
    page: number,
    limit: number,
    searchParam: FilterChargeDto
  ): Promise<ChargePagination> {
    return this.chargeDatasource.getByParams(page, limit, searchParam);
  }

  getAll(page: number, limit: number): Promise<ChargePagination> {
    return this.chargeDatasource.getAll(page, limit);
  }

  create(
    createChargeDto: CreateChargeDto
  ): Promise<{ ok: boolean; charge: ChargeEntity }> {
    return this.chargeDatasource.create(createChargeDto);
  }

  update(
    updateChargeDto: UpdateChargeDto
  ): Promise<{ ok: boolean; message: string }> {
    return this.chargeDatasource.update(updateChargeDto);
  }

  delete(id: string): Promise<{ ok: boolean; message: string }> {
    return this.chargeDatasource.delete(id);
  }
}
