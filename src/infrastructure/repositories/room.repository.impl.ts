import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { RoomPagination } from '../../domain/interfaces';
import { RoomRepository } from '../../domain/repositories';

export class RoomRepositoryImpl extends RoomRepository {
  constructor(private readonly roomDataSource: RoomDatasource) {
    super();
  }

  getAll(
    page: number,
    limit: number,
    isAvailable?: boolean
  ): Promise<RoomPagination> {
    return isAvailable === undefined
      ? this.roomDataSource.getAll(page, limit)
      : this.roomDataSource.getAllAvailable(page, limit, isAvailable);
  }

  async create(
    createRoomDto: CreateRoomDto
  ): Promise<{ ok: boolean; room: RoomEntity }> {
    return this.roomDataSource.create(createRoomDto);
  }

  async getById(id: string): Promise<{ ok: boolean; room: RoomEntity }> {
    return this.roomDataSource.getById(id);
  }

  async update(
    updateRoomDto: UpdateRoomDto
  ): Promise<{ ok: boolean; message: string }> {
    return this.roomDataSource.update(updateRoomDto);
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    return this.roomDataSource.delete(id);
  }
}
