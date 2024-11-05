import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { GuestPagination, IGuest } from '@domain/interfaces';
import { variables } from '@domain/variables';
import { Generator } from '@src/utils/generator';
import { PaginationDto, CreateGuestDto, FilterGuestDto } from '@domain/dtos';
import { GuestService } from '.';
import { GuestDatasource } from '@src/domain/datasources';

describe('guest.service.ts', () => {
  const fullName = Generator.randomName();

  const guest: IGuest = {
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
  };

  const pagination: GuestPagination = {
    guests: [guest],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  const resolveData = { ok: true, message: '' };

  const mockGuestDatasource: GuestDatasource = {
    getAll: jest.fn().mockResolvedValue(pagination),
    getById: jest.fn().mockResolvedValue({ ok: true, guest }),
    getByParams: jest.fn().mockResolvedValue(pagination),
    create: jest.fn().mockResolvedValue({ ok: true, guest }),
    update: jest.fn().mockResolvedValue(resolveData),
    delete: jest.fn().mockResolvedValue(resolveData),
  };

  it('should have been call with parameters (getAll)', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const guestService = new GuestService(mockGuestDatasource);

    await guestService.getAll(paginationDto);

    expect(mockGuestDatasource.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  it('should have been call with parameters (getByParams)', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const params: FilterGuestDto = { checkIn: new Date() };
    const guestService = new GuestService(mockGuestDatasource);

    await guestService.getByParams(paginationDto, params);

    expect(mockGuestDatasource.getByParams).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      params
    );
  });

  it('should have been call with parameters (getById)', async () => {
    const id = Uuid.v4();
    const guestService = new GuestService(mockGuestDatasource);

    await guestService.getById(id);

    expect(mockGuestDatasource.getById).toHaveBeenCalledWith(id);
  });

  it('should have been call with parameters (create)', async () => {
    const guestDto = {} as CreateGuestDto;
    const guestService = new GuestService(mockGuestDatasource);

    await guestService.create(guestDto);

    expect(mockGuestDatasource.create).toHaveBeenCalledWith(guestDto);
  });

  it('should have been call with parameters (update)', async () => {
    const guestService = new GuestService(mockGuestDatasource);

    await guestService.update({ id: guest.id });

    expect(mockGuestDatasource.update).toHaveBeenCalledWith({ id: guest.id });
  });

  it('should have been call with parameters (delete)', async () => {
    const guestService = new GuestService(mockGuestDatasource);

    await guestService.delete(guest.id);

    expect(mockGuestDatasource.delete).toHaveBeenCalledWith(guest.id);
  });
});
