import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';
import { RoomPagination, RoomTypesList } from '../interfaces';
import { RoomDatasource } from './room.datasource';
describe('room.database.ts', () => {
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

  class MockRoomDataSource implements RoomDatasource {
    async getAllAvailable(
      page: number,
      limit: number,
      isAvailable: boolean
    ): Promise<RoomPagination> {
      return getAllReturnValue;
    }

    async getAll(page: number, limit: number): Promise<RoomPagination> {
      return getAllReturnValue;
    }

    async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
      return mockRoom2;
    }

    async getById(id: string): Promise<RoomEntity> {
      return mockRoom;
    }

    async update(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
      return mockRoom;
    }

    async delete(id: string): Promise<RoomEntity> {
      return mockRoom2;
    }
  }

  test('test in function getAll()', async () => {
    const mockRoomDataSource = new MockRoomDataSource();

    expect(mockRoomDataSource).toBeInstanceOf(MockRoomDataSource);
    expect(typeof mockRoomDataSource.getAll).toBe('function');
    expect(mockRoomDataSource.getAll(page, limit)).resolves.toEqual(
      getAllReturnValue
    );

    const { rooms } = await mockRoomDataSource.getAll(page, limit);

    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    rooms.forEach((room) => {
      expect(room).toBeInstanceOf(RoomEntity);
    });
  });

  test('test in function getAllAvailable()', async () => {
    const mockRoomDataSource = new MockRoomDataSource();

    expect(mockRoomDataSource).toBeInstanceOf(MockRoomDataSource);
    expect(typeof mockRoomDataSource.getAllAvailable).toBe('function');
    expect(
      mockRoomDataSource.getAllAvailable(page, limit, isAvailable)
    ).resolves.toEqual(getAllReturnValue);

    const { rooms } = await mockRoomDataSource.getAllAvailable(
      page,
      limit,
      isAvailable
    );

    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    rooms.forEach((room) => {
      expect(room).toBeInstanceOf(RoomEntity);
    });
  });
});
