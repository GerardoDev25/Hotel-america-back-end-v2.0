import { CreateRoomDto, UpdateRoomDto } from '@domain/dtos';
import { RoomFilter, RoomPagination, IRoom } from '@domain/interfaces';

export abstract class RoomDatasource {
  abstract getAll(page: number, limit: number): Promise<RoomPagination>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: RoomFilter
  ): Promise<RoomPagination>;

  abstract getAllAvailable(
    page: number,
    limit: number,
    isAvailable: boolean
  ): Promise<RoomPagination>;

  abstract getById(id: string): Promise<{ ok: boolean; room: IRoom }>;

  abstract create(
    createRoomDto: CreateRoomDto
  ): Promise<{ ok: boolean; room: IRoom }>;

  abstract update(
    updateRoomDto: UpdateRoomDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
