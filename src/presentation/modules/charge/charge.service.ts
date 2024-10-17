import { ChargeRepository } from '@domain/repositories';
import { PaginationDto } from '@domain/dtos/share';
import {
  CreateChargeDto,
  FilterChargeDto,
  UpdateChargeDto,
} from '@domain/dtos/charge';

export class ChargeService {
  constructor(private readonly chargeRepository: ChargeRepository) {}

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.chargeRepository.getAll(page, limit);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterChargeDto: FilterChargeDto
  ) {
    const { page, limit } = paginationDto;
    return this.chargeRepository.getByParams(page, limit, filterChargeDto);
  }

  async getById(id: string) {
    return this.chargeRepository.getById(id);
  }

  async create(createChargeDto: CreateChargeDto) {
    return this.chargeRepository.create(createChargeDto);
  }

  async update(updateChargeDto: UpdateChargeDto) {
    return this.chargeRepository.update(updateChargeDto);
  }

  async delete(id: string) {
    return this.chargeRepository.delete(id);
  }
}
