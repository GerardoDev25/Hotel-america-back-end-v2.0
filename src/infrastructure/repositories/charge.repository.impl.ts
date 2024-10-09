import { CreateChargeDto, UpdateChargeDto } from '@domain/dtos/charge';
import { ICharge, ChargePagination } from '@domain/interfaces';
import { ChargeDatasource } from '@domain/datasources';
import { ChargeEntity } from '@domain/entities';
import { ChargeRepository } from '@domain/repositories';

export class ChargeRepositoryImpl extends ChargeRepository {
  constructor(private readonly chargeDatasource: ChargeDatasource) {
    super();
  }

  getById(id: string): Promise<{ ok: boolean; charge: ChargeEntity }> {
    return this.chargeDatasource.getById(id);
  }

  getByParam(
    searchParam: Partial<Pick<ICharge, keyof ICharge>>
  ): Promise<{ ok: boolean; charge: ChargeEntity | null }> {
    return this.chargeDatasource.getByParam(searchParam);
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
