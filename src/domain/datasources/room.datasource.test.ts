/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateRoomDto, UpdateRoomDto } from '@domain/dtos/room';
import { RoomEntity } from '@domain/entities';
import { RoomPagination, RoomTypesList } from '@domain/interfaces';

import { RoomDatasource } from './room.datasource';
import { Uuid } from '@src/adapters';

describe('room.database.ts', () => {
  const page = 2;
  const limit = 10;
  const isAvailable = true;

  const mockRoom = new RoomEntity({
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  });
  const mockRoom2 = new RoomEntity({
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  });

  const roomPagination = {
    rooms: [mockRoom, mockRoom2],
    limit,
    next: '',
    page,
    prev: '',
    total: 0,
  };

  class MockRoomDataSource implements RoomDatasource {
    async getAllAvailable(
      page: number,
      limit: number,
      isAvailable: boolean
    ): Promise<RoomPagination> {
      return roomPagination;
    }

    async getAll(page: number, limit: number): Promise<RoomPagination> {
      return roomPagination;
    }

    async create(
      createRoomDto: CreateRoomDto
    ): Promise<{ ok: boolean; room: RoomEntity }> {
      return { ok: true, room: mockRoom2 };
    }

    async getById(id: string): Promise<{ ok: boolean; room: RoomEntity }> {
      return { ok: true, room: mockRoom };
    }

    async update(
      updateRoomDto: UpdateRoomDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }

    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: '' };
    }
  }

  const mockRoomDataSource = new MockRoomDataSource();
  test('test in function getAll()', async () => {
    const { rooms } = await mockRoomDataSource.getAll(page, limit);

    expect(typeof mockRoomDataSource.getAll).toBe('function');
    expect(mockRoomDataSource.getAll(page, limit)).resolves.toEqual(
      roomPagination
    );
    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    rooms.forEach((room) => {
      expect(room).toBeInstanceOf(RoomEntity);
    });
  });

  test('test in function getAllAvailable()', async () => {
    const { rooms } = await mockRoomDataSource.getAllAvailable(
      page,
      limit,
      isAvailable
    );

    expect(typeof mockRoomDataSource.getAllAvailable).toBe('function');
    expect(
      mockRoomDataSource.getAllAvailable(page, limit, isAvailable)
    ).resolves.toEqual(roomPagination);

    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    rooms.forEach((room) => {
      expect(room).toBeInstanceOf(RoomEntity);
    });
  });

  test('test in function getById()', async () => {
    const id = Uuid.v4();
    const { ok, room } = await mockRoomDataSource.getById(id);

    expect(ok).toBeTruthy();
    expect(room).toBeInstanceOf(RoomEntity);
    expect(typeof mockRoomDataSource.getById).toBe('function');
    expect(mockRoomDataSource.getById(id)).resolves.toEqual({
      ok: true,
      room: expect.any(RoomEntity),
    });
  });

  test('test in function create()', async () => {
    const { id, ...rest } = mockRoom;

    const { ok, room } = await mockRoomDataSource.create(rest);

    expect(ok).toBeTruthy();
    expect(room).toBeInstanceOf(RoomEntity);
    expect(typeof mockRoomDataSource.create).toBe('function');
    expect(mockRoomDataSource.create(rest)).resolves.toEqual({
      ok: true,
      room: mockRoom2,
    });
  });

  test('test in function update()', async () => {
    const { ok, message } = await mockRoomDataSource.update(mockRoom);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockRoomDataSource.update).toBe('function');
    expect(mockRoomDataSource.update(mockRoom)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  test('test in function delete()', async () => {
    const id = Uuid.v4();
    const { ok, message } = await mockRoomDataSource.delete(id);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockRoomDataSource.delete).toBe('function');
    expect(mockRoomDataSource.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });
});
