import {
  CreateRegisterDto,
  FilterRegisterDto,
  UpdateRegisterDto,
} from '@domain/dtos/register';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { RegisterRepository, RoomRepository } from '@domain/repositories';
import { CreateGuestDto } from '@src/domain/dtos/guest';

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

  async getByParams(
    paginationDto: PaginationDto,
    filterRegisterDto: FilterRegisterDto
  ) {
    const { page, limit } = paginationDto;
    return this.registerRepository.getByParams(page, limit, filterRegisterDto);
  }

  async getById(id: string) {
    return this.registerRepository.getById(id);
  }

  create = async (createRegisterDto: CreateRegisterDto) => {
    const page = 1;
    const limit = 1;

    try {
      const [{ registers }, { room }] = await Promise.all([
        this.registerRepository.getByParams(page, limit, {
          roomId: createRegisterDto.roomId,
        }),
        this.roomRepository.getById(createRegisterDto.roomId),
      ]);

      if (!room.isAvailable || registers[0]) {
        throw CustomError.conflict(
          `room with id ${createRegisterDto.roomId} is not available`
        );
      }
    } catch (error) {
      throw this.handleError(error);
    }

    return this.registerRepository.create(createRegisterDto);
  };
  async checkIn(data: {
    registerDto: CreateRegisterDto;
    guestDtos: CreateGuestDto[];
  }) {
    const { registerDto } = data;
    const page = 1;
    const limit = 1;
    try {
      const [{ registers }, { room }] = await Promise.all([
        this.registerRepository.getByParams(page, limit, {
          roomId: registerDto.roomId,
        }),
        this.roomRepository.getById(registerDto.roomId),
      ]);

      if (!room.isAvailable || registers[0]) {
        throw CustomError.conflict(
          `room with id ${registerDto.roomId} is not available`
        );
      }
    } catch (error) {
      throw this.handleError(error);
    }

    return this.registerRepository.checkIn(data);
  }

  async checkOut(id: string) {
    return this.registerRepository.checkOut(id);
  }

  async update(updateRegisterDto: UpdateRegisterDto) {
    return this.registerRepository.update(updateRegisterDto);
  }

  async delete(id: string) {
    return this.registerRepository.delete(id);
  }
}
