import { GuestRepository } from '@domain/repositories';
import { PaginationDto } from '@domain/dtos/share';
import {
  CreateGuestDto,
  UpdateGuestDto,
  FilterGuestDto,
} from '@domain/dtos/guest';

export class GuestService {
  constructor(private readonly guestRepository: GuestRepository) {}

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.guestRepository.getAll(page, limit);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterGuestDto: FilterGuestDto
  ) {
    const { page, limit } = paginationDto;
    return this.guestRepository.getByParams(page, limit, filterGuestDto);
  }

  async getById(id: string) {
    return this.guestRepository.getById(id);
  }

  async create(createGuestDto: CreateGuestDto) {
    return this.guestRepository.create(createGuestDto);
  }

  async update(updateGuestDto: UpdateGuestDto) {
    return this.guestRepository.update(updateGuestDto);
  }

  async delete(id: string) {
    return this.guestRepository.delete(id);
  }
}
