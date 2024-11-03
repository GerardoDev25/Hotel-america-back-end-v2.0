import {
  PaginationDto,
  CreateChargeDto,
  FilterChargeDto,
  UpdateChargeDto,
} from '@domain/dtos';
import { ChargeDatasource } from '@domain/datasources';

export class ChargeService {
  constructor(private readonly chargeDatasource: ChargeDatasource) {}

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.chargeDatasource.getAll(page, limit);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterChargeDto: FilterChargeDto
  ) {
    const { page, limit } = paginationDto;
    return this.chargeDatasource.getByParams(page, limit, filterChargeDto);
  }

  async getById(id: string) {
    return this.chargeDatasource.getById(id);
  }

  async create(createChargeDto: CreateChargeDto) {
    return this.chargeDatasource.create(createChargeDto);
  }

  async update(updateChargeDto: UpdateChargeDto) {
    return this.chargeDatasource.update(updateChargeDto);
  }

  async delete(id: string) {
    return this.chargeDatasource.delete(id);
  }
}
