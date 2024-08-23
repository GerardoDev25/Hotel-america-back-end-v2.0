import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { RoomTypesList } from '../../domain/interfaces';
import { RoomRepositoryImpl } from './room.repository.impl';

describe('room.repository.impl.ts', () => {
  const createRoom: CreateRoomDto = {
    roomType: RoomTypesList.SUIT,
    roomNumber: 1,
    betsNumber: 1,
    isAvailable: false,
  };

  const updateRoom: UpdateRoomDto = {
    id: 'abv',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 2,
    betsNumber: 2,
    isAvailable: true,
  };

  const roomList: RoomEntity[] = [
    {
      id: 'id-1',
      roomType: RoomTypesList.NORMAL,
      roomNumber: 1,
      betsNumber: 1,
      isAvailable: false,
    },
    {
      id: 'id-2',
      roomType: RoomTypesList.SUIT,
      roomNumber: 2,
      betsNumber: 2,
      isAvailable: true,
    },
  ];

  const mockDatasource: RoomDatasource = {
    getAll: jest.fn().mockResolvedValue(roomList),
    getById: jest.fn().mockResolvedValue(roomList[0]),
    create: jest.fn().mockResolvedValue(roomList[1]),
    update: jest.fn().mockResolvedValue(roomList[1]),
    delete: jest.fn().mockResolvedValue(roomList[1]),
  };
  const repository = new RoomRepositoryImpl(mockDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAll', async () => {
    const rooms = await repository.getAll();
    expect(mockDatasource.getAll).toHaveBeenCalled();
    expect(rooms).toEqual(roomList);
  });

  test('should call getById', async () => {
    const room = await repository.getById('some-id');
    expect(mockDatasource.getById).toHaveBeenCalledWith(expect.any(String));
    expect(room).toEqual(roomList[0]);
  });

  test('should call create with parameter', async () => {
    const room = await repository.create(createRoom);
    expect(mockDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockDatasource.create).toHaveBeenCalledWith(createRoom);
    expect(room).toEqual(roomList[1]);
  });

  test('should call update with parameter', async () => {
    const room = await repository.update(updateRoom);
    expect(mockDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockDatasource.update).toHaveBeenCalledWith(updateRoom);
    expect(room).toEqual(roomList[1]);
  });

  test('should call delete', async () => {
    const room = await repository.delete('some-id');
    expect(mockDatasource.delete).toHaveBeenCalledWith(expect.any(String));
    expect(room).toEqual(roomList[1]);
  });
});
