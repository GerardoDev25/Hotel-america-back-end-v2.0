import { Uuid } from '../../config/adapters/';
import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { RoomRepository } from '../../domain/repositories';

import { rooms } from '../../utils/data/data-test';

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
  async findById(id: string): Promise<RoomEntity> {
    return this.roomDataSource.findById(id);
  }
  async updateById(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    return this.roomDataSource.updateById(updateRoomDto);
  }
  async deleteById(id: string): Promise<RoomEntity> {
    return this.roomDataSource.deleteById(id);
  }
}
