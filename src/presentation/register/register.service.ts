import {
  CreateRegisterDto,
  UpdateRegisterDto,
} from '../../domain/dtos/register';
import { PaginationDto } from '../../domain/dtos/share';
import { CustomError } from '../../domain/error';
import { RegisterRepository } from '../../domain/repositories/register.repository';
import { RoomRepository } from '../../domain/repositories/room.repository';
export class RegisterService {
  constructor(
    private readonly registerRepository: RegisterRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  private handleError(error: unknown) {
    if (error instanceof CustomError) throw error;
    throw CustomError.internalServerError('Internal Server Error');
  }

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.registerRepository.getAll(page, limit);
  }

  async getById(id: string) {
    return this.registerRepository.getById(id);
  }

  async create(createRegisterDto: CreateRegisterDto) {
    try {
      const { room } = await this.roomRepository.getById(
        createRegisterDto.roomId
      );

      if (!room.isAvailable) {
        throw CustomError.conflict(
          `room with id ${createRegisterDto.roomId} is not available`
        );
      }
    } catch (error) {
      throw this.handleError(error);
    }

    return this.registerRepository.create(createRegisterDto);
  }

  async update(updateRegisterDto: UpdateRegisterDto) {
    return this.registerRepository.update(updateRegisterDto);
  }

  async delete(id: string) {
    return this.registerRepository.delete(id);
  }
}
