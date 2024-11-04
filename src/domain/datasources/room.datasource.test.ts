/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateRoomDto, UpdateRoomDto } from '@domain/dtos';
import { RoomFilter, RoomPagination, IRoom } from '@domain/interfaces';

import { RoomDatasource } from './room.datasource';
import { Uuid } from '@src/adapters';

describe('room.database.ts', () => {
  const page = 2;
  const limit = 10;
  const isAvailable = true;

  const mockRoom: IRoom = {
    id: 'abc',
    roomType: 'normal',
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
    state: 'free',
  };
  const mockRoom2: IRoom = {
    id: 'abc',
    roomType: 'normal',
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
    state: 'free',
  };

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

    async getByParams(
      page: number,
      limit: number,
      searchParam: RoomFilter
    ): Promise<RoomPagination> {
      return roomPagination;
    }

    async create(
      createRoomDto: CreateRoomDto
    ): Promise<{ ok: boolean; room: IRoom }> {
      return { ok: true, room: mockRoom2 };
    }

    async getById(id: string): Promise<{ ok: boolean; room: IRoom }> {
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
      expect(room).toMatchObject({
        id: expect.any(String),
        roomType: expect.any(String),
        roomNumber: expect.any(Number),
        betsNumber: expect.any(Number),
        isAvailable: expect.any(Boolean),
        state: expect.any(String),
      });
    });
  });

  test('test in function getByParams()', async () => {
    const params: RoomFilter = { isAvailable: true, state: 'pending_cleaning' };

    const { rooms } = await mockRoomDataSource.getByParams(page, limit, params);

    expect(typeof mockRoomDataSource.getByParams).toBe('function');
    expect(mockRoomDataSource.getAll(page, limit)).resolves.toEqual(
      roomPagination
    );
    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    rooms.forEach((room) => {
      expect(room).toMatchObject({
        id: expect.any(String),
        roomType: expect.any(String),
        roomNumber: expect.any(Number),
        betsNumber: expect.any(Number),
        isAvailable: expect.any(Boolean),
        state: expect.any(String),
      });
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
      expect(room).toMatchObject({
        id: expect.any(String),
        roomType: expect.any(String),
        roomNumber: expect.any(Number),
        betsNumber: expect.any(Number),
        isAvailable: expect.any(Boolean),
        state: expect.any(String),
      });
    });
  });

  test('test in function getById()', async () => {
    const id = Uuid.v4();
    const { ok, room } = await mockRoomDataSource.getById(id);

    expect(ok).toBeTruthy();
    expect(room).toMatchObject({
      id: expect.any(String),
      roomType: expect.any(String),
      roomNumber: expect.any(Number),
      betsNumber: expect.any(Number),
      isAvailable: expect.any(Boolean),
      state: expect.any(String),
    });
    expect(typeof mockRoomDataSource.getById).toBe('function');
    expect(mockRoomDataSource.getById(id)).resolves.toEqual({
      ok: true,
      room: expect.any(Object),
    });
  });

  test('test in function create()', async () => {
    const { id, ...rest } = mockRoom;

    const { ok, room } = await mockRoomDataSource.create(rest);

    expect(ok).toBeTruthy();
    expect(room).toMatchObject({
      id: expect.any(String),
      roomType: expect.any(String),
      roomNumber: expect.any(Number),
      betsNumber: expect.any(Number),
      isAvailable: expect.any(Boolean),
      state: expect.any(String),
    });
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
