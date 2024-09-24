import { CreateRegisterDto } from '@domain/dtos/register';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { RegisterEntity } from '@domain/entities';
import { RegisterPagination } from '@domain/interfaces';
import { RegisterRepository } from '@domain/repositories';
import { Uuid } from '@src/adapters';
import { RegisterService } from '.';

describe('register.service.ts', () => {
  const register = new RegisterEntity({
    id: Uuid.v4(),
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
    discount: 0,
    guestsNumber: 1,
    price: 100,
    checkIn: new Date().toISOString(),
    checkOut: new Date().toISOString(),
  });

  const pagination: RegisterPagination = {
    registers: [register],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  const resolveData = { ok: true, message: '' };

  const mockRegisterRepository: RegisterRepository = {
    getAll: jest.fn().mockResolvedValue(pagination),
    getById: jest.fn().mockResolvedValue({ ok: true, register }),
    getByParam: jest.fn().mockResolvedValue({ ok: true, register }),
    create: jest.fn().mockResolvedValue({ ok: true, register }),
    update: jest.fn().mockResolvedValue(resolveData),
    delete: jest.fn().mockResolvedValue(resolveData),
  };

  const room = { isAvailable: true };
  const mockRoomRepository = {
    getById: jest.fn().mockResolvedValue({ room }),
  } as any;

  test('should have been call with parameters (getAll)', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.getAll(paginationDto);

    expect(mockRegisterRepository.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  test('should have been call with parameters (getById)', async () => {
    const id = Uuid.v4();

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.getById(id);

    expect(mockRegisterRepository.getById).toHaveBeenCalledWith(id);
  });

  test('should have been call with parameters (create)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;

    const mockRegisterRepository = {
      getByParam: jest.fn().mockResolvedValue({ ok: false, register: null }),
      create: jest.fn().mockResolvedValue({ ok: true, register }),
    } as any;

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.create(registerDto);

    expect(mockRegisterRepository.create).toHaveBeenCalledWith(registerDto);
    expect(mockRoomRepository.getById).toHaveBeenCalledWith(registerDto.roomId);
    expect(mockRegisterRepository.getByParam).toHaveBeenCalledWith({
      roomId: registerDto.roomId,
    });
  });

  test('should throw error if room is not available (create)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;

    const mockRegisterRepository = {
      getByParam: jest.fn().mockResolvedValue({ ok: false, register: null }),
      create: jest.fn(),
    } as any;

    const mockRoomRepository = {
      getById: jest.fn().mockResolvedValue({ room: { isAvailable: false } }),
    } as any;

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    try {
      await registerService.create(registerDto);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe(
        `room with id ${registerDto.roomId} is not available`
      );
      expect(mockRegisterRepository.create).not.toHaveBeenCalled();
    }
  });

  test('should throw error if register with roomId exist (create)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;

    const mockRegisterRepository = {
      getByParam: jest.fn().mockResolvedValue({ ok: false, register: {} }),
      create: jest.fn(),
    } as any;

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    try {
      await registerService.create(registerDto);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe(
        `room with id ${registerDto.roomId} is not available`
      );
      expect(mockRegisterRepository.create).not.toHaveBeenCalled();
    }
  });

  test('should have been call with parameters (update)', async () => {
    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.update({ id: register.id });

    expect(mockRegisterRepository.update).toHaveBeenCalledWith({
      id: register.id,
    });
  });

  test('should have been call with parameters (delete)', async () => {
    const id = Uuid.v4();

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.delete(id);

    expect(mockRegisterRepository.delete).toHaveBeenCalledWith(id);
  });
});
