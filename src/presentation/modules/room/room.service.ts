import { CreateRoomDto, UpdateRoomDto } from '../../../domain/dtos/room';
import { PaginationDto } from '../../../domain/dtos/share';
import { RoomRepository } from '../../../domain/repositories';

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async getAll(paginationDto: PaginationDto, isAvailable?: boolean) {
    const { page, limit } = paginationDto;
    return this.roomRepository.getAll(page, limit, isAvailable);
  }

  async getById(id: string) {
    return this.roomRepository.getById(id);
  }

  async create(createRoomDto: CreateRoomDto) {
    return this.roomRepository.create(createRoomDto);
  }

  async update(updateRoomDto: UpdateRoomDto) {
    return this.roomRepository.update(updateRoomDto);
  }

  async delete(id: string) {
    return this.roomRepository.delete(id);
  }
}
