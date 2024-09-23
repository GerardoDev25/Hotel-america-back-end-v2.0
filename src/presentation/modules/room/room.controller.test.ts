import { Request, Response } from 'express';

import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { UpdateRoomDto } from '@domain/dtos/room';
import { RoomController } from './';
import { Uuid } from '@src/adapters';

describe('room.controller.ts', () => {
  const room1 = {
    roomType: 'normal',
    roomNumber: 128,
    betsNumber: 2,
    isAvailable: true,
  };

  test('should return all rooms when getAllRoom is called (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = {
      query: { page: '1', limit: '10', isAvailable: 'true' },
    } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue([room1]),
    } as any;

    const roomController = new RoomController(mockService);
    await roomController.getAllRoom(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([room1]);
  });

  test('should retrieve all rooms with default pagination when no query parameters are provided (getAll)', async () => {
    const req = { query: {} } as any;
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue([room1]),
    } as any;

    const roomController = new RoomController(mockService);

    await roomController.getAllRoom(req, res);

    expect(res.json).toHaveBeenCalledWith([room1]);
    expect(mockService.getAll).toHaveBeenCalledWith(
      expect.any(PaginationDto),
      undefined
    );
  });

  it('should  return error if is not well paginated (getAll)', async () => {
    const req = { query: { page: 'hol' } } as any;
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue([room1]),
    } as any;

    const roomController = new RoomController(mockService);
    await roomController.getAllRoom(req, res);

    expect(res.json).toHaveBeenCalledWith({
      errors: ['Page and limit must be a number'],
      ok: false,
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should  return error if isAvailable param is invalid (getAll)', async () => {
    const req = { query: { isAvailable: 'hol' } } as any;
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue([room1]),
    } as any;

    const roomController = new RoomController(mockService);
    await roomController.getAllRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['isAvailable most be true or false'],
      ok: false,
    });
  });

  it('should return throw error when room ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const mockService = { getById: jest.fn().mockResolvedValue(room1) } as any;
    const roomController = new RoomController(mockService);

    await roomController.getByIdRoom(req, res);

    expect(mockService.getById).toHaveBeenCalledWith('non-existent-id');
    expect(roomController.getByIdRoom).rejects.toThrow();
  });

  it('should return throw error when room ID does not exist (getById)', async () => {
    const req = { params: { id: 'non-existent-id' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const mockService = { getById: jest.fn().mockResolvedValue(room1) } as any;
    const roomController = new RoomController(mockService);

    try {
      await roomController.getByIdRoom(req, res);
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

    const mockService = { create: jest.fn().mockResolvedValue(room1) } as any;
    const roomController = new RoomController(mockService);

    await roomController.createRoom(req, res);

    expect(mockService.create).toHaveBeenCalledWith(room1);
  });

  it('should update a room when updateRoom is called (update)', async () => {
    const req = { body: { id: Uuid.v4() } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    const data = { ok: true, message: '' };
    const mockService = { update: jest.fn().mockResolvedValue(data) } as any;
    const roomController = new RoomController(mockService);

    await roomController.updateRoom(req, res);

    expect(res.json).toHaveBeenCalledWith(data);
    expect(mockService.update).toHaveBeenCalledWith(expect.any(UpdateRoomDto));
  });

  it('should delete a room when deleteRoom is called (delete)', async () => {
    const req = { params: { id: 'some-room-id' } } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const data = { ok: true, message: '' };
    const mockService = { delete: jest.fn().mockResolvedValue(data) } as any;
    const roomController = new RoomController(mockService);

    await roomController.deletedRoom(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(req.params.id);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});
