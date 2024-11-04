import { Uuid } from '@src/adapters';
import { CustomError } from '@domain/error';
import { RoomFilter, RoomPagination, IRoom } from '@domain/interfaces';
import {
  PaginationDto,
  CreateRoomDto,
  FilterRoomDto,
  UpdateRoomDto,
} from '@domain/dtos';
import { RoomController } from './';

describe('room.controller.ts', () => {
  const room1: IRoom = {
    id: Uuid.v4(),
    roomType: 'normal',
    state: 'free',
    roomNumber: 128,
    betsNumber: 2,
    isAvailable: true,
  };
  const pagination: RoomPagination = {
    rooms: [room1],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };
  it('should return all rooms when getAllRoom is called (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10, isAvailable: true } } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;

    const roomController = new RoomController(mockService);
    await roomController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should retrieve all rooms with default pagination when no query parameters are provided (getAll)', async () => {
    const req = { query: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const roomController = new RoomController(mockService);

    await roomController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(pagination);
    expect(mockService.getAll).toHaveBeenCalledWith(
      expect.any(PaginationDto),
      undefined
    );
  });

  it('should  return error if is not well paginated (getAll)', async () => {
    const req = { query: { page: 'hol' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const roomController = new RoomController(mockService);

    await roomController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['Page and limit must be a number'],
      ok: false,
    });
  });

  it('should  return error if isAvailable param is invalid (getAll)', async () => {
    const req = { query: { isAvailable: 'hol' } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;

    const roomController = new RoomController(mockService);
    await roomController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['isAvailable most be true or false'],
      ok: false,
    });
  });

  it('should return all rooms when getAllRoom is called (getByParams)', async () => {
    const body: RoomFilter = {
      roomType: 'normal',
      state: 'free',
      roomNumber: 128,
      betsNumber: 2,
      isAvailable: true,
    };

    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 }, body } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;

    const roomController = new RoomController(mockService);
    await roomController.getByParams(req, res);

    expect(mockService.getByParams).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should retrieve all rooms with default pagination when no query parameters are provided (getByParams)', async () => {
    const body = {};
    const req = { query: {}, body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const roomController = new RoomController(mockService);

    await roomController.getByParams(req, res);

    expect(res.json).toHaveBeenCalledWith(pagination);
    expect(mockService.getByParams).toHaveBeenCalledWith(
      expect.any(PaginationDto),
      expect.any(FilterRoomDto)
    );
  });

  it('should  return error if is not well paginated (getByParams)', async () => {
    const req = { query: { page: 'hol' }, body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const roomController = new RoomController(mockService);

    await roomController.getByParams(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['Page and limit must be a number'],
      ok: false,
    });
  });

  it('should return throw error when room ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const mockService = { getById: jest.fn().mockResolvedValue(room1) } as any;
    const roomController = new RoomController(mockService);

    await roomController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith('non-existent-id');
    expect(roomController.getById).rejects.toThrow();
  });

  it('should return throw error when room ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const mockService = { getById: jest.fn().mockResolvedValue(room1) } as any;
    const roomController = new RoomController(mockService);

    try {
      await roomController.getById(req, res);
    } catch (error) {
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Room not found' });
      expect(mockService.getById).toHaveBeenCalledWith('non-existent-id');
      expect(error).toBeInstanceOf(CustomError);
    }
  });

  it('should create a new room when createRoom is called (create)', async () => {
    const req = { body: room1 } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = room1;
    const [errors, roomDto] = CreateRoomDto.create({ ...rest });

    const mockService = { create: jest.fn().mockResolvedValue(roomDto) } as any;
    const roomController = new RoomController(mockService);

    await roomController.create(req, res);

    expect(errors).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(roomDto);
    expect(mockService.create).toHaveBeenCalledWith(roomDto);
  });

  it('should update a room when updateRoom is called (update)', async () => {
    const req = { body: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const data = { ok: true, message: '' };
    const mockService = { update: jest.fn().mockResolvedValue(data) } as any;
    const roomController = new RoomController(mockService);

    await roomController.update(req, res);

    expect(res.json).toHaveBeenCalledWith(data);
    expect(mockService.update).toHaveBeenCalledWith(expect.any(UpdateRoomDto));
  });

  it('should delete a room when deleteRoom is called (delete)', async () => {
    const req = { params: { id: 'some-room-id' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const data = { ok: true, message: '' };
    const mockService = { delete: jest.fn().mockResolvedValue(data) } as any;
    const roomController = new RoomController(mockService);

    await roomController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(req.params.id);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});
