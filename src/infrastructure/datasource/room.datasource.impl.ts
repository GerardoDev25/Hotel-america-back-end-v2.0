import { prisma } from '../../data/postgres';
import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { CustomError } from '../../domain/error';
import { RoomPagination } from '../../domain/interfaces';

// TODO ADD LOGGER TO CATCH ERROR

export class RoomDatasourceImpl extends RoomDatasource {
  async getAllAvailable(
    page: number,
    limit: number,
    isAvailable: boolean
  ): Promise<RoomPagination> {
    try {
      const [total, rooms] = await Promise.all([
        prisma.room.count({ where: { isAvailable } }),

        prisma.room.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: { isAvailable },
        }),
      ]);

      return {
        page,
        limit,
        total,
        next:
          page * limit < total
            ? `/api/room?page=${page + 1}&limit=${limit}`
            : null,
        prev: page - 1 > 0 ? `/api/room?page=${page - 1}&limit=${limit}` : null,
        rooms: rooms.map((room) => RoomEntity.fromObject(room)),
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async getAll(page: number, limit: number): Promise<RoomPagination> {
    try {
      const [total, rooms] = await Promise.all([
        prisma.room.count(),
        prisma.room.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { roomNumber: 'asc' },
        }),
      ]);

      return {
        page,
        limit,
        total,
        next:
          page * limit < total
            ? `/api/room?page=${page + 1}&limit=${limit}`
            : null,
        prev: page - 1 > 0 ? `/api/room?page=${page - 1}&limit=${limit}` : null,
        rooms: rooms.map((room) => RoomEntity.fromObject(room)),
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    try {
      const newRoom = await prisma.room.create({ data: createRoomDto });

      return RoomEntity.fromObject(newRoom);
    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async getById(id: string): Promise<RoomEntity> {
    try {
      const room = await prisma.room.findUnique({ where: { id } });

      if (!room) {
        throw CustomError.notFound(`todo with id: ${id} not found`);
      }

      return RoomEntity.fromObject(room);
    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async update(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    const { id } = updateRoomDto;

    await this.getById(id);

    try {
      const updatedRoom = await prisma.room.update({
        where: { id },
        data: updateRoomDto,
      });

      return RoomEntity.fromObject(updatedRoom);
    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async delete(id: string): Promise<RoomEntity> {
    await this.getById(id);

    try {
      const deletedRoom = await prisma.room.delete({
        where: { id },
      });

      return RoomEntity.fromObject(deletedRoom);
    } catch (error) {
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }
}
