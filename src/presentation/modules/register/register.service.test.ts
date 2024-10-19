import { CreateRegisterDto } from '@domain/dtos/register';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { GuestEntity, RegisterEntity } from '@domain/entities';
import { RegisterCheckOut, RegisterPagination } from '@domain/interfaces';
import { RegisterRepository } from '@domain/repositories';
import { Uuid } from '@src/adapters';
import { RegisterService } from '.';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { variables } from '@src/domain/variables';
import { CreateGuestDto } from '@src/domain/dtos/guest';

describe('register.service.ts', () => {
  const page = 1;
  const limit = 1;

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

  const registerCheckOutDetail: RegisterCheckOut = {
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
    checkOut: Generator.randomDate(),
    discount: 0,
    price: 0,
    roomNumber: 0,
    totalCharges: 0,
    totalPayments: 0,
    guests: [],
    charges: [],
    payments: [],
  };

  const fullName = Generator.randomName();
  const guest = new GuestEntity({
    id: Uuid.v4(),
    di: Generator.randomIdentityNumber(),
    city: Generator.randomCity(citiesList),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    phone: Generator.randomPhone(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    countryId: Uuid.v4(),
    registerId: Uuid.v4(),
    dateOfBirth: new Date().toISOString(),
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
    getByParams: jest.fn().mockResolvedValue(pagination),
    create: jest.fn().mockResolvedValue({ ok: true, register }),
    update: jest.fn().mockResolvedValue(resolveData),
    delete: jest.fn().mockResolvedValue(resolveData),
    checkOut: jest.fn().mockResolvedValue({ ok: true, registerCheckOutDetail }),
    checkIn: jest
      .fn()
      .mockResolvedValue({ register, guests: [guest], ok: true }),
  };

  const room = { isAvailable: true };
  const mockRoomRepository = {
    getById: jest.fn().mockResolvedValue({ room }),
  } as any;

  it('should have been call with parameters (getAll)', async () => {
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

  it('should have been call with parameters (getById)', async () => {
    const id = Uuid.v4();

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.getById(id);

    expect(mockRegisterRepository.getById).toHaveBeenCalledWith(id);
  });

  it('should have been call with parameters (create)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;

    const mockRegisterRepository = {
      getByParams: jest
        .fn()
        .mockResolvedValue({ ...pagination, registers: [] }),
      create: jest.fn().mockResolvedValue({ ok: true, register }),
    } as any;

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.create(registerDto);

    expect(mockRegisterRepository.create).toHaveBeenCalledWith(registerDto);
    expect(mockRoomRepository.getById).toHaveBeenCalledWith(registerDto.roomId);
    expect(mockRegisterRepository.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      {
        roomId: registerDto.roomId,
      }
    );
  });

  it('should throw error if room is not available (create)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;

    const mockRegisterRepository = {
      getByParams: jest
        .fn()
        .mockResolvedValue({ ...pagination, registers: [] }),
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

  it('should throw error if register with roomId exist (create)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;

    const mockRegisterRepository = {
      getByParams: jest
        .fn()
        .mockResolvedValue({ ...pagination, registers: [] }),
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

  it('should have been call with parameters (checkIn)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;
    const guestDtos = [] as CreateGuestDto[];

    const mockRegisterRepository = {
      getByParams: jest
        .fn()
        .mockResolvedValue({ ...pagination, registers: [] }),
      checkIn: jest
        .fn()
        .mockResolvedValue({ ok: true, register, guests: [guest] }),
    } as unknown as RegisterRepository;

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.checkIn({ guestDtos, registerDto });

    expect(mockRegisterRepository.checkIn).toHaveBeenCalledWith({
      registerDto,
      guestDtos,
    });
    expect(mockRoomRepository.getById).toHaveBeenCalledWith(registerDto.roomId);
    expect(mockRegisterRepository.getByParams).toHaveBeenCalledWith(
      page,
      limit,
      { roomId: registerDto.roomId }
    );
  });

  it('should throw error if room is not available (checkIn)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;
    const guestDtos = [] as CreateGuestDto[];

    const mockRegisterRepository = {
      getByParams: jest
        .fn()
        .mockResolvedValue({ ...pagination, registers: [] }),
      checkIn: jest.fn(),
    } as unknown as RegisterRepository;

    const mockRoomRepository = {
      getById: jest.fn().mockResolvedValue({ room: { isAvailable: false } }),
    } as any;

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    try {
      await registerService.checkIn({ registerDto, guestDtos });
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe(
        `room with id ${registerDto.roomId} is not available`
      );
      expect(mockRegisterRepository.checkIn).not.toHaveBeenCalled();
    }
  });

  it('should have been call with parameters (checkOut)', async () => {
    const id = Uuid.v4();

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.checkOut(id);

    expect(mockRegisterRepository.checkOut).toHaveBeenCalledWith(id);
  });

  it('should throw error if register with roomId exist (checkIn)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;
    const guestDtos = [] as CreateGuestDto[];

    const mockRegisterRepository = {
      getByParams: jest.fn().mockResolvedValue(pagination),
      checkIn: jest.fn(),
    } as unknown as RegisterRepository;

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    try {
      await registerService.checkIn({ registerDto, guestDtos });
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe(
        `room with id ${registerDto.roomId} is not available`
      );
      expect(mockRegisterRepository.checkIn).not.toHaveBeenCalled();
    }
  });

  it('should have been call with parameters (update)', async () => {
    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.update({ id: register.id });

    expect(mockRegisterRepository.update).toHaveBeenCalledWith({
      id: register.id,
    });
  });

  it('should have been call with parameters (delete)', async () => {
    const id = Uuid.v4();

    const registerService = new RegisterService(
      mockRegisterRepository,
      mockRoomRepository
    );

    await registerService.delete(id);

    expect(mockRegisterRepository.delete).toHaveBeenCalledWith(id);
  });
});
