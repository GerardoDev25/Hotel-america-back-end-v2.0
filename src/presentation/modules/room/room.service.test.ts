import { CreateRoomDto, UpdateRoomDto, PaginationDto } from '@domain/dtos';
import { RoomFilter } from '@domain/interfaces';
import { RoomDatasource } from '@domain/datasources';
import { RoomService } from '.';

describe('room.service.ts', () => {
  const mockRoomDatasource = {
    getAll: jest.fn(),
    getAllAvailable: jest.fn(),
    getByParams: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as RoomDatasource;

  it('should to have been called with parameter (getAll)', async () => {
    const isAvailable = undefined;
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new RoomService(mockRoomDatasource);

    await service.getAll(paginationDto, isAvailable);

    expect(mockRoomDatasource.getAll).toHaveBeenCalledTimes(1);
    expect(mockRoomDatasource.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  it('should to have been called with parameter (getAllAvailable)', async () => {
    const isAvailable = true;
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new RoomService(mockRoomDatasource);

    await service.getAll(paginationDto, isAvailable);

    expect(mockRoomDatasource.getAllAvailable).toHaveBeenCalledTimes(1);
    expect(mockRoomDatasource.getAllAvailable).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      isAvailable
    );
  });

  it('should to have been called with parameter (getByParams)', async () => {
    const params: RoomFilter = { state: 'pending_cleaning' };
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new RoomService(mockRoomDatasource);

    await service.getByParams(paginationDto, params);

    expect(mockRoomDatasource.getByParams).toHaveBeenCalledTimes(1);
    expect(mockRoomDatasource.getByParams).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      params
    );
  });

  it('should to have been called with parameter (getById)', async () => {
    const id = 'some-id';
    const service = new RoomService(mockRoomDatasource);

    await service.getById(id);

    expect(mockRoomDatasource.getById).toHaveBeenCalledTimes(1);
    expect(mockRoomDatasource.getById).toHaveBeenCalledWith(id);
  });

  it('should to have been called with parameter (create)', async () => {
    const [errors, room] = CreateRoomDto.create({
      roomType: 'normal',
      roomNumber: 129,
      betsNumber: 3,
      isAvailable: true,
      state: 'free',
    });
    const service = new RoomService(mockRoomDatasource);

    await service.create(room!);

    expect(errors).toBeUndefined();
    expect(mockRoomDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockRoomDatasource.create).toHaveBeenCalledWith(room);
  });

  it('should to have been called with parameter (update)', async () => {
    const [errors, room] = UpdateRoomDto.create({
      roomType: 'normal',
      roomNumber: 129,
      betsNumber: 3,
      isAvailable: true,
    });
    const service = new RoomService(mockRoomDatasource);
    await service.update(room!);

    expect(errors).toBeDefined();
    expect(mockRoomDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockRoomDatasource.update).toHaveBeenCalledWith(room);
  });

  it('should to have been called with parameter (delete)', async () => {
    const id = 'some-id';
    const service = new RoomService(mockRoomDatasource);
    await service.delete(id);

    expect(mockRoomDatasource.delete).toHaveBeenCalledTimes(1);
    expect(mockRoomDatasource.delete).toHaveBeenCalledWith(id);
  });
});
