import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';

export abstract class RoomDatasource {
  // todo pagination
  abstract getAll(): Promise<RoomEntity[]>;
  abstract getById(id: string): Promise<RoomEntity>;
  abstract create(createRoomDto: CreateRoomDto): Promise<RoomEntity>;
  abstract update(updateRoomDto: UpdateRoomDto): Promise<RoomEntity>;
  abstract delete(id: string): Promise<RoomEntity>;
}
