import { CreateRoomDto, FilterRoomDto, UpdateRoomDto } from '@domain/dtos/room';
import { PaginationDto } from '@domain/dtos/share';
import { RoomDatasource } from '@domain/datasources';

export class RoomService {
  constructor(private readonly roomDatasource: RoomDatasource) {}

  async getAll(paginationDto: PaginationDto, isAvailable?: boolean) {
    const { page, limit } = paginationDto;
    return isAvailable === undefined
      ? this.roomDatasource.getAll(page, limit)
      : this.roomDatasource.getAllAvailable(page, limit, isAvailable);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterRoomDto: FilterRoomDto
  ) {
    const { page, limit } = paginationDto;
    return this.roomDatasource.getByParams(page, limit, filterRoomDto);
  }

  async getById(id: string) {
    return this.roomDatasource.getById(id);
  }

  async create(createRoomDto: CreateRoomDto) {
    return this.roomDatasource.create(createRoomDto);
  }

  async update(updateRoomDto: UpdateRoomDto) {
    return this.roomDatasource.update(updateRoomDto);
  }

  async delete(id: string) {
    return this.roomDatasource.delete(id);
  }
}
