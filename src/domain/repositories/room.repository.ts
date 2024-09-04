import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';
import { RoomPagination } from '../interfaces';

export abstract class RoomRepository {
  abstract getAll(
    page: number,
    limit: number,
    isAvailable?: boolean
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
