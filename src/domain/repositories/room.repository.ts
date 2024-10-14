import { CreateRoomDto, UpdateRoomDto } from '@domain/dtos/room';
import { RoomEntity } from '@domain/entities';
import { RoomFilter, RoomPagination } from '@domain/interfaces';

export abstract class RoomRepository {
  abstract getAll(
    page: number,
    limit: number,
    isAvailable?: boolean
  ): Promise<RoomPagination>;

  abstract getByParams(
    page: number,
    limit: number,
    searchParam: RoomFilter
  ): Promise<RoomPagination>;

  abstract getById(id: string): Promise<{ ok: boolean; room: RoomEntity }>;

  abstract create(
    createRoomDto: CreateRoomDto
  ): Promise<{ ok: boolean; room: RoomEntity }>;

  abstract update(
    updateRoomDto: UpdateRoomDto
  ): Promise<{ ok: boolean; message: string }>;

  abstract delete(id: string): Promise<{ ok: boolean; message: string }>;
}
