import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { PaginationDto } from '@domain/dtos/share';
import { GuestEntity } from '@domain/entities';
import { GuestPagination } from '@domain/interfaces';
import { GuestRepository, RegisterRepository } from '@domain/repositories';
import { variables } from '@domain/variables';
import { Generator } from '@src/utils/generator';
import { CreateGuestDto } from '@domain/dtos/guest';
import { CustomError } from '@domain/error';
import { GuestService } from '.';

describe('guest.service.ts', () => {
  const fullName = Generator.randomName();

  const guest = new GuestEntity({
    id: Uuid.v4(),
    phone: Generator.randomPhone(),
    registerId: Uuid.v4(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    city: Generator.randomCity(citiesList),
    countryId: 'BO',
    dateOfBirth: Generator.randomDate(),
    di: Generator.randomIdentityNumber(),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    checkIn: new Date().toISOString(),
    checkOut: new Date().toISOString(),
  });

  const pagination: GuestPagination = {
    guests: [guest],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  const resolveData = { ok: true, message: '' };

  const mockGuestRepository: GuestRepository = {
    getAll: jest.fn().mockResolvedValue(pagination),
    getById: jest.fn().mockResolvedValue({ ok: true, guest }),
    getByParam: jest.fn().mockResolvedValue({ ok: true, guest }),
    create: jest.fn().mockResolvedValue({ ok: true, guest }),
    update: jest.fn().mockResolvedValue(resolveData),
    delete: jest.fn().mockResolvedValue(resolveData),
  };

  const mockRegisterRepository = {
    getById: jest.fn(),
  } as unknown as RegisterRepository;

  test('should have been call with parameters (getAll)', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const guestService = new GuestService(
      mockGuestRepository,
      mockRegisterRepository
    );

    await guestService.getAll(paginationDto);

    expect(mockGuestRepository.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  test('should have been call with parameters (getById)', async () => {
    const id = Uuid.v4();
    const guestService = new GuestService(
      mockGuestRepository,
      mockRegisterRepository
    );

    await guestService.getById(id);

    expect(mockGuestRepository.getById).toHaveBeenCalledWith(id);
  });

  test('should have been call with parameters (create)', async () => {
    const guestDto = { registerId: Uuid.v4() } as CreateGuestDto;

    // const mockRegisterRepository = {
    //   getById: jest.fn().mockRejectedValue(CustomError.badRequest('')),
    // } as unknown as RegisterRepository;

    const guestService = new GuestService(
      mockGuestRepository,
      mockRegisterRepository
    );

    await guestService.create(guestDto);

    expect(mockGuestRepository.create).toHaveBeenCalledWith(guestDto);
    expect(mockRegisterRepository.getById).toHaveBeenCalledWith(
      guestDto.registerId
    );
  });

  test('should throw error if register not found (create)', async () => {
    const guestDto = { registerId: Uuid.v4() } as CreateGuestDto;

    const mockRegisterRepository = {
      getById: jest.fn().mockRejectedValue(CustomError.badRequest('')),
    } as unknown as RegisterRepository;

    const guestService = new GuestService(
      mockGuestRepository,
      mockRegisterRepository
    );
    try {
      await guestService.create(guestDto);
    } catch {
      expect(mockGuestRepository.create).not.toHaveBeenCalled();
      expect(mockRegisterRepository.getById).toHaveBeenCalledWith(
        guestDto.registerId
      );
    }
  });

  test('should have been call with parameters (update)', async () => {
    const guestService = new GuestService(
      mockGuestRepository,
      mockRegisterRepository
    );

    await guestService.update({ id: guest.id });

    expect(mockGuestRepository.update).toHaveBeenCalledWith({ id: guest.id });
  });

  test('should have been call with parameters (delete)', async () => {
    const guestService = new GuestService(
      mockGuestRepository,
      mockRegisterRepository
    );

    await guestService.delete(guest.id);

    expect(mockGuestRepository.delete).toHaveBeenCalledWith(guest.id);
  });
});
