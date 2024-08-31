import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';
import { RoomPagination } from '../interfaces';

export abstract class RoomDatasource {
  abstract getAll(page: number, limit: number): Promise<RoomPagination>;

  abstract getAllAvailable(
    page: number,
    limit: number,
    isAvailable: boolean
  ): Promise<RoomPagination>;

  abstract getById(id: string): Promise<RoomEntity>;

  abstract create(createRoomDto: CreateRoomDto): Promise<RoomEntity>;

  abstract update(updateRoomDto: UpdateRoomDto): Promise<RoomEntity>;

  abstract delete(id: string): Promise<RoomEntity>;
}
