import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { PaginationDto } from '../../domain/dtos/share';
import { RoomRepository } from '../../domain/repositories';
import { UserService } from './user.service';

describe('room.service.ts', () => {
  const mockRoomRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as RoomRepository;

  it('should to have been called with parameter (getAll)', async () => {
    const isAvailable = true;
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new UserService(mockRoomRepository);

    await service.getAll(paginationDto, isAvailable);

    expect(mockRoomRepository.getAll).toHaveBeenCalledTimes(1);
    expect(mockRoomRepository.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      isAvailable
    );
  });

  it('should to have been called with parameter (getById)', async () => {
    const id = 'some-id';
    const service = new UserService(mockRoomRepository);

    await service.getById(id);

    expect(mockRoomRepository.getById).toHaveBeenCalledTimes(1);
    expect(mockRoomRepository.getById).toHaveBeenCalledWith(id);
  });

  it('should to have been called with parameter (create)', async () => {
    const room = CreateRoomDto.create({
      roomType: 'normal',
      roomNumber: 129,
      betsNumber: 3,
      isAvailable: true,
    });
    const service = new UserService(mockRoomRepository);

    await service.create(room);

    expect(mockRoomRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRoomRepository.create).toHaveBeenCalledWith(room);
  });

  it('should to have been called with parameter (update)', async () => {
    const room = UpdateRoomDto.create({
      roomType: 'normal',
      roomNumber: 129,
      betsNumber: 3,
      isAvailable: true,
    });
    const service = new UserService(mockRoomRepository);
    await service.update(room);

    expect(mockRoomRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRoomRepository.update).toHaveBeenCalledWith(room);
  });

  it('should to have been called with parameter (delete)', async () => {
    const id = 'some-id'
    const service = new UserService(mockRoomRepository);
    await service.delete(id);

    expect(mockRoomRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockRoomRepository.delete).toHaveBeenCalledWith(id);
  });
});
