import { Uuid } from '../../config/adapters/';
import { RoomDatabase } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { RoomRepository } from '../../domain/repositories';

import { rooms } from '../../utils/data/data-test';

export class RoomRepositoryImpl extends RoomRepository {
  constructor(private readonly roomDataSource: RoomDatabase) {
    super();
  }

  async getAll(): Promise<RoomEntity[]> {
    return rooms.map(RoomEntity.fromObject);
  }
  async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    return RoomEntity.fromObject({ ...createRoomDto, id: Uuid.v4() });
  }
  async findById(id: string): Promise<RoomEntity> {
    const room = rooms.find((room) => room.id === id) ?? rooms[0];
    return RoomEntity.fromObject(room);
  }
  async updateById(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    return RoomEntity.fromObject(rooms[1]);
  }
  async deleteById(id: string): Promise<RoomEntity> {
    return RoomEntity.fromObject(rooms[2]);
  }
}
