import { ChargeRepository } from '@domain/repositories';
import { CreateChargeDto, UpdateChargeDto } from '@src/domain/dtos/charge';
import { PaginationDto } from '@src/domain/dtos/share';

export class ChargeService {
  constructor(private readonly chargeRepository: ChargeRepository) {}

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.chargeRepository.getAll(page, limit);
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
