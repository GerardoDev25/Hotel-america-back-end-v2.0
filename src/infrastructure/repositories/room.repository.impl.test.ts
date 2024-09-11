import { Uuid } from '../../adapters';
import { RoomDatasource } from '../../domain/datasources';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { RoomEntity } from '../../domain/entities';
import { RoomTypesList } from '../../domain/interfaces';
import { RoomRepositoryImpl } from './room.repository.impl';

describe('room.repository.impl.ts', () => {
  const page = 2;
  const limit = 10;

  const mockDatasource: RoomDatasource = {
    getAll: jest.fn(),
    getAllAvailable: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const repository = new RoomRepositoryImpl(mockDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAll', async () => {
    await repository.getAll(page, limit);

    expect(mockDatasource.getAll).toHaveBeenCalled();
    expect(mockDatasource.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call getAllAvailable', async () => {
    const isAvailable = true;

    await repository.getAll(page, limit, isAvailable);

    expect(mockDatasource.getAllAvailable).toHaveBeenCalledTimes(1);
    expect(mockDatasource.getAllAvailable).toHaveBeenCalledWith(
      page,
      limit,
      isAvailable
    );
  });

  test('should call getById', async () => {
    const id = Uuid.v4();

    await repository.getById(id);

    expect(mockDatasource.getById).toHaveBeenCalledTimes(1);
    expect(mockDatasource.getById).toHaveBeenCalledWith(id);
  });

  test('should call create with parameter', async () => {
    const createRoom: CreateRoomDto = {
      roomType: RoomTypesList.SUIT,
      roomNumber: 1,
      betsNumber: 1,
      isAvailable: false,
    };

    await repository.create(createRoom);

    expect(mockDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockDatasource.create).toHaveBeenCalledWith(createRoom);
  });

  test('should call update with parameter', async () => {
    const updateRoom: UpdateRoomDto = {
      id: 'abv',
      roomType: RoomTypesList.NORMAL,
      roomNumber: 2,
      betsNumber: 2,
      isAvailable: true,
    };

    await repository.update(updateRoom);

    expect(mockDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockDatasource.update).toHaveBeenCalledWith(updateRoom);
  });

  test('should call delete', async () => {
    const id = Uuid.v4();

    await repository.delete(id);

    expect(mockDatasource.delete).toHaveBeenCalledTimes(1);
    expect(mockDatasource.delete).toHaveBeenCalledWith(id);
  });
});
