import { GuestRepository, RegisterRepository } from '@domain/repositories';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@src/domain/dtos/share';
import { CreateGuestDto, UpdateGuestDto } from '@src/domain/dtos/guest';

export class GuestService {
  constructor(
    private readonly guestRepository: GuestRepository,
    private readonly registerRepository: RegisterRepository
  ) {}

  private handleError(error: unknown) {
    if (error instanceof CustomError) throw error;
    throw CustomError.internalServerError('Internal Server Error');
  }

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.guestRepository.getAll(page, limit);
  }

  async getById(id: string) {
    return this.guestRepository.getById(id);
  }

  async create(createGuestDto: CreateGuestDto) {
    try {
      await this.registerRepository.getById(createGuestDto.registerId);
    } catch (error) {
      throw this.handleError(error);
    }

    return this.guestRepository.create(createGuestDto);
  }

  async update(updateGuestDto: UpdateGuestDto) {
    return this.guestRepository.update(updateGuestDto);
  }

  async delete(id: string) {
    return this.guestRepository.delete(id);
  }
}
