import { CreateRoomDto, UpdateRoomDto } from '@domain/dtos';
import { CustomError } from '@domain/error';
import { RoomDatasource } from '@domain/datasources';
import { RoomFilter, RoomPagination, IRoom } from '@domain/interfaces';

import { LoggerService } from '@presentation/services';

import { prisma } from '@src/data/postgres';
import { cleanObject, pagination } from '@src/utils';

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
          orderBy: { roomNumber: 'asc' },
        }),
      ]);

      const rooms = roomsDb.map((room) => ({
        ...room,
        isAvailable: room.isAvailable ?? false,
      }));

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

      const rooms = roomsDb.map((room) => ({
        ...room,
        isAvailable: room.isAvailable ?? false,
      }));
      const { next, prev } = pagination({ page, limit, total, path: 'room' });

      return { page, limit, total, next, prev, rooms };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getByParams(
    page: number,
    limit: number,
    searchParam: RoomFilter
  ): Promise<RoomPagination> {
    try {
      const where = cleanObject(searchParam);

      const [totalDB, roomsDb] = await Promise.all([
        prisma.room.count({ where }),
        prisma.room.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { roomNumber: 'asc' },
        }),
      ]);

      const rooms = roomsDb.map((room) => ({
        ...room,
        isAvailable: room.isAvailable ?? false,
      }));
      const total = roomsDb.length === 0 ? 0 : totalDB;
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'room/get-by-params',
      });

      return { page, limit, total, next, prev, rooms };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async create(
    createDto: CreateRoomDto
  ): Promise<{ ok: boolean; room: IRoom }> {
    try {
      const room = await prisma.room.findUnique({
        where: { roomNumber: createDto.roomNumber },
      });
      if (room) {
        throw CustomError.conflict(
          `room with roomNumber: ${createDto.roomNumber} already exists`
        );
      }
    } catch (error: any) {
      throw this.handleError(error);
    }

    try {
      const newRoom = await prisma.room.create({ data: createDto });

      return {
        ok: true,
        room: { ...newRoom, isAvailable: newRoom.isAvailable ?? false },
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<{ ok: boolean; room: IRoom }> {
    try {
      const dbRoom = await prisma.room.findUnique({ where: { id } });

      if (!dbRoom) {
        throw CustomError.notFound(`room with id: ${id} not found`);
      }

      return {
        ok: true,
        room: { ...dbRoom, isAvailable: dbRoom.isAvailable ?? false },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  async update(
    updateDto: UpdateRoomDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updateDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      if (data.roomNumber) {
        const room = await prisma.room.findUnique({
          where: { roomNumber: data.roomNumber },
        });
        if (room) {
          throw CustomError.conflict(
            `room with roomNumber: ${data.roomNumber} already exists`
          );
        }
      }
    } catch (error: any) {
      throw this.handleError(error);
    }

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
