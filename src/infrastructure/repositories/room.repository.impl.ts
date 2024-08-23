import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { RoomRepository } from '../../domain/repositories';

export class RoomRepositoryImpl extends RoomRepository {
  constructor(private readonly roomDataSource: RoomDatasource) {
    super();
  }

  async getAll(): Promise<RoomEntity[]> {
    return this.roomDataSource.getAll();
  }
  async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    return this.roomDataSource.create(createRoomDto);
  }
  async getById(id: string): Promise<RoomEntity> {
    return this.roomDataSource.getById(id);
  }
  async update(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    return this.roomDataSource.update(updateRoomDto);
  }
  async delete(id: string): Promise<RoomEntity> {
    return this.roomDataSource.delete(id);
  }
}
