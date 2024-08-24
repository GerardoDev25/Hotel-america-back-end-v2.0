import { prisma } from '../../data/postgres';
import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { CustomError } from '../../domain/error';

export class RoomDatasourceImpl extends RoomDatasource {
  async getAll(): Promise<RoomEntity[]> {
    const rooms = await prisma.room.findMany();

    return rooms.map(RoomEntity.fromObject);
  }
  async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    const newRoom = await prisma.room.create({ data: createRoomDto });

    return RoomEntity.fromObject(newRoom);
  }
  async getById(id: string): Promise<RoomEntity> {
    const room = await prisma.room.findUnique({ where: { id } });

    if (!room) {
      throw new CustomError(404, `todo with id: ${id} not found`);
    }

    return RoomEntity.fromObject(room);
  }
  async update(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    const { id } = updateRoomDto;

    await this.getById(id);

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });

    return RoomEntity.fromObject(updatedRoom);
  }

  async delete(id: string): Promise<RoomEntity> {
    await this.getById(id);

    const deletedRoom = await prisma.room.delete({
      where: { id },
    });

    return RoomEntity.fromObject(deletedRoom);
  }
}
