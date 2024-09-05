import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { RoomTypesList } from '../../domain/interfaces';
import { RoomRepositoryImpl } from './room.repository.impl';

describe('room.repository.impl.ts', () => {
  const page = 2;
  const limit = 10;
  const isAvailable = true;

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
  const mockDatasource: RoomDatasource = {
    getAll: jest.fn().mockResolvedValue(getAllReturnValue),
    getAllAvailable: jest.fn().mockResolvedValue(getAllReturnValue),
    getById: jest.fn().mockResolvedValue(mockRoom),
    create: jest.fn().mockResolvedValue(mockRoom2),
    update: jest.fn().mockResolvedValue(mockRoom2),
    delete: jest.fn().mockResolvedValue(mockRoom2),
  };
  const repository = new RoomRepositoryImpl(mockDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAll', async () => {
    const rooms = await repository.getAll(page, limit);

    expect(mockDatasource.getAll).toHaveBeenCalled();
    expect(mockDatasource.getAll).toHaveBeenCalledWith(page, limit);

    expect(rooms).toEqual(getAllReturnValue);
  });

  test('should call getAllAvailable', async () => {
    const roomsAvailable = await repository.getAll(page, limit, isAvailable);

    expect(mockDatasource.getAllAvailable).toHaveBeenCalled();
    expect(mockDatasource.getAllAvailable).toHaveBeenCalledWith(
      page,
      limit,
      isAvailable
    );
    expect(roomsAvailable).toEqual(getAllReturnValue);
  });

  test('should call getById', async () => {
    const room = await repository.getById('some-id');
    expect(mockDatasource.getById).toHaveBeenCalledWith(expect.any(String));
    expect(room).toEqual(mockRoom);
  });

  test('should call create with parameter', async () => {
    const room = await repository.create(createRoom);

    expect(mockDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockDatasource.create).toHaveBeenCalledWith(createRoom);
    expect(room).toEqual(mockRoom2);
  });

  test('should call update with parameter', async () => {
    const room = await repository.update(updateRoom);
    expect(mockDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockDatasource.update).toHaveBeenCalledWith(updateRoom);
    expect(room).toEqual(mockRoom2);
  });

  test('should call delete', async () => {
    const room = await repository.delete('some-id');
    expect(mockDatasource.delete).toHaveBeenCalledWith(expect.any(String));
    expect(room).toEqual(mockRoom2);
  });
});
