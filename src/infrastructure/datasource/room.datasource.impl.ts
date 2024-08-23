import { Uuid } from '../../config/adapters';
import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';

import { rooms } from '../../utils/data/data-test';

export class RoomDatasourceImpl extends RoomDatasource {
  async getAll(): Promise<RoomEntity[]> {
    return rooms.map(RoomEntity.fromObject);
  }
  async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    return RoomEntity.fromObject({ ...createRoomDto, id: Uuid.v4() });
  }
  async getById(id: string): Promise<RoomEntity> {
    const room = rooms.find((room) => room.id === id) ?? rooms[0];
    return RoomEntity.fromObject(room);
  }
  async update(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    return RoomEntity.fromObject(rooms[1]);
  }
  async delete(id: string): Promise<RoomEntity> {
    return RoomEntity.fromObject(rooms[2]);
  }
}
