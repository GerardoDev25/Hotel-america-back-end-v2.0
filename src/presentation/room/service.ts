import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomRepository } from '../../domain/repositories';

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}
  async createRoom(createRoomDto: CreateRoomDto) {
    return this.roomRepository.create(createRoomDto);
  }

  async updateRoom(updateRoomDto: UpdateRoomDto) {
    return this.roomRepository.update(updateRoomDto);
  }
}
