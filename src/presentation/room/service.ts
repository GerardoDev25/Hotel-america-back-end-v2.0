import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomRepository } from '../../domain/repositories';

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async getAll() {
    return this.roomRepository.getAll();
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
