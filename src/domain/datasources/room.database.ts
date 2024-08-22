import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';

export abstract class RoomDatabase {
  // todo pagination
  abstract getAll(): Promise<RoomEntity[]>;
  abstract create(createRoomDto: CreateRoomDto): Promise<RoomEntity>;
  abstract findById(id: number): Promise<RoomEntity>;
  abstract updateById(updateRoomDto: UpdateRoomDto): Promise<RoomEntity>;
  abstract deleteById(id: number): Promise<RoomEntity>;
}
