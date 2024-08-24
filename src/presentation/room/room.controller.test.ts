import { Request, Response } from 'express';
import { RoomController } from './controller';
import { CustomError } from '../../domain/error';

// todo BEFORE I HAVE TO IMPLEMENT ROOM.SERVICE IN ORDER TO HANDLE THE ERROR


describe('room.controller.ts', () => {
  // Successfully retrieve all rooms
  it('should return all rooms when getAllRoom is called', async () => {
    // Arrange
    const mockRoomService = {
      getAll: jest.fn().mockResolvedValue([{ id: '1', roomType: 'Single' }]),
    };
    const req = {} as Request;

    const res = {
      json: jest.fn(),
    } as unknown as Response;
    const roomController = new RoomController(mockRoomService as any);

    // Act
    await roomController.getAllRoom(req, res);

    // Assert
    expect(mockRoomService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id: '1', roomType: 'Single' }]);
  });

  // it('should return 404 error when room ID does not exist', async () => {
  //   // Arrange
  //   const mockRoomService = {
  //     getById: jest
  //       .fn()
  //       .mockRejectedValue(CustomError.notFound('Room not found')),
  //   };
  //   const req = { params: { id: 'non-existent-id' } } as unknown as Request;
    
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   } as unknown as Response;

  //   const roomController = new RoomController(mockRoomService as any);

  //   // Act
  //   await roomController.getByIdRoom(req, res);

  //   // Assert
  //   expect(mockRoomService.getById).toHaveBeenCalledWith('non-existent-id');
  //   expect(res.status).toHaveBeenCalledWith(404);
  //   expect(res.json).toHaveBeenCalledWith({ error: 'Room not found' });
  // });
});
