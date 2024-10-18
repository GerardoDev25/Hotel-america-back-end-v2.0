import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { PaginationDto } from '@domain/dtos/share';
import { GuestEntity } from '@domain/entities';
import { GuestPagination } from '@domain/interfaces';
import { GuestRepository } from '@domain/repositories';
import { variables } from '@domain/variables';
import { Generator } from '@src/utils/generator';
import { CreateGuestDto, FilterGuestDto } from '@domain/dtos/guest';
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
    getByParams: jest.fn().mockResolvedValue(pagination),
    create: jest.fn().mockResolvedValue({ ok: true, guest }),
    update: jest.fn().mockResolvedValue(resolveData),
    delete: jest.fn().mockResolvedValue(resolveData),
  };

  it('should have been call with parameters (getAll)', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const guestService = new GuestService(mockGuestRepository);

    await guestService.getAll(paginationDto);

    expect(mockGuestRepository.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  it('should have been call with parameters (getByParams)', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const params: FilterGuestDto = { checkIn: new Date() };
    const guestService = new GuestService(mockGuestRepository);

    await guestService.getByParams(paginationDto, params);

    expect(mockGuestRepository.getByParams).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      params
    );
  });

  it('should have been call with parameters (getById)', async () => {
    const id = Uuid.v4();
    const guestService = new GuestService(mockGuestRepository);

    await guestService.getById(id);

    expect(mockGuestRepository.getById).toHaveBeenCalledWith(id);
  });

  it('should have been call with parameters (create)', async () => {
    const guestDto = {} as CreateGuestDto;
    const guestService = new GuestService(mockGuestRepository);

    await guestService.create(guestDto);

    expect(mockGuestRepository.create).toHaveBeenCalledWith(guestDto);
  });

  it('should have been call with parameters (update)', async () => {
    const guestService = new GuestService(mockGuestRepository);

    await guestService.update({ id: guest.id });

    expect(mockGuestRepository.update).toHaveBeenCalledWith({ id: guest.id });
  });

  it('should have been call with parameters (delete)', async () => {
    const guestService = new GuestService(mockGuestRepository);

    await guestService.delete(guest.id);

    expect(mockGuestRepository.delete).toHaveBeenCalledWith(guest.id);
  });
});
