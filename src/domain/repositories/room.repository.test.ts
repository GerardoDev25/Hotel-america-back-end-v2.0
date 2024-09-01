import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';
import { RoomPagination, RoomTypesList } from '../interfaces';
import { RoomRepository } from './room.repository';
describe('room.repository.ts', () => {
  const page = 2;
  const limit = 10;
  const isAvailable = true;

  const mockRoom: RoomEntity = new RoomEntity({
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  });
  const mockRoom2: RoomEntity = new RoomEntity({
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  });

  const getAllReturnValue = {
    rooms: [mockRoom, mockRoom2],
    limit,
    next: '',
    page,
    prev: '',
    total: 0,
  };
  class MockRoomDataSource implements RoomRepository {
    async getAll(
      page: number,
      limit: number,
      isAvailable: boolean
    ): Promise<RoomPagination> {
      return getAllReturnValue;
    }

    async getById(id: string): Promise<{ ok: boolean; room: RoomEntity }> {
      return { ok: true, room: mockRoom };
    }
    async create(
      createRoomDto: CreateRoomDto
    ): Promise<{ ok: boolean; room: RoomEntity }> {
      return { ok: true, room: mockRoom2 };
    }
    async update(
      updateRoomDto: UpdateRoomDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'update' };
    }
    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'delete' };
    }
  }

  test('test in function getAll()', async () => {
    const mockRoomDataSource = new MockRoomDataSource();

    expect(mockRoomDataSource).toBeInstanceOf(MockRoomDataSource);
    expect(typeof mockRoomDataSource.getAll).toBe('function');

    expect(
      mockRoomDataSource.getAll(page, limit, isAvailable)
    ).resolves.toEqual(getAllReturnValue);

    const { rooms } = await mockRoomDataSource.getAll(page, limit, isAvailable);

    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    rooms.forEach((room) => {
      expect(room).toBeInstanceOf(RoomEntity);
    });
  });
});
