import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';
import { RoomTypesList } from '../interfaces';
import { RoomDatasource } from './room.datasource';
describe('room.database.ts', () => {
  const mockRoom: RoomEntity = {
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  };
  const mockRoom2: RoomEntity = {
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  };

  class MockRoomDataSource implements RoomDatasource {
    async getAll(): Promise<RoomEntity[]> {
      return [mockRoom, mockRoom2];
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
    expect(mockRoomDataSource.getAll()).resolves.toEqual([mockRoom, mockRoom2]);

    const rooms = await mockRoomDataSource.getAll();

    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    // expect(rooms[0]).toBeInstanceOf(RoomEntity);
  });
});
