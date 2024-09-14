import { prisma } from '../../data/postgres';
import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { CustomError } from '../../domain/error';
import { RoomPagination } from '../../domain/interfaces';
import { LoggerService } from '../../presentation/services';
import { cleanObject, pagination } from '../../utils';

export class RoomDatasourceImpl extends RoomDatasource {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  private handleError(error: any) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      this.logger.error((error as Error).message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async getAllAvailable(
    page: number,
    limit: number,
    isAvailable: boolean
  ): Promise<RoomPagination> {
    try {
      const [total, roomsDb] = await Promise.all([
        prisma.room.count({ where: { isAvailable } }),

        prisma.room.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: { isAvailable },
        }),
      ]);

      const rooms = roomsDb.map((room) => RoomEntity.fromObject(room));
      const { next, prev } = pagination({ page, limit, total, path: 'room' });

      return { page, limit, total, next, prev, rooms };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAll(page: number, limit: number): Promise<RoomPagination> {
    try {
      const [total, roomsDb] = await Promise.all([
        prisma.room.count(),
        prisma.room.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { roomNumber: 'asc' },
        }),
      ]);

      const rooms = roomsDb.map((room) => RoomEntity.fromObject(room));
      const { next, prev } = pagination({ page, limit, total, path: 'room' });

      return { page, limit, total, next, prev, rooms };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async create(
    createRoomDto: CreateRoomDto
  ): Promise<{ ok: boolean; room: RoomEntity }> {
    try {
      const newRoom = await prisma.room.create({ data: createRoomDto });

      return { ok: true, room: RoomEntity.fromObject(newRoom) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<{ ok: boolean; room: RoomEntity }> {
    try {
      const room = await prisma.room.findUnique({ where: { id } });

      if (!room) {
        throw CustomError.notFound(`room with id: ${id} not found`);
      }

      return { ok: true, room: RoomEntity.fromObject(room) };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.log(error);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async update(
    updateRoomDto: UpdateRoomDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updateRoomDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.room.update({ where: { id }, data });
      return { ok: true, message: 'room updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    await this.getById(id);

    try {
      await prisma.room.delete({ where: { id } });

      return { ok: true, message: 'room deleted successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
