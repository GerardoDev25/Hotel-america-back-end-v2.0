import { CreateGuestDto, CreateRegisterDto, PaginationDto } from '@domain/dtos';
import {
  IGuest,
  IRegister,
  RegisterCheckOut,
  RegisterPagination,
} from '@domain/interfaces';
import { RegisterDatasource } from '@domain/datasources';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { variables } from '@src/domain/variables';
import { RegisterService } from '.';
import { CustomError } from '@src/domain/error';

describe('register.service.ts', () => {
  const register: IRegister = {
    id: Uuid.v4(),
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
    discount: 0,
    guestsNumber: 1,
    price: 100,
    checkIn: new Date().toISOString(),
    checkOut: new Date().toISOString(),
  };

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
  const guest: IGuest = {
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
  };

  const pagination: RegisterPagination = {
    registers: [register],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  const resolveData = { ok: true, message: '' };

  const mockRegisterDatasource: RegisterDatasource = {
    getAll: jest.fn().mockResolvedValue(pagination),
    getById: jest.fn().mockResolvedValue({ ok: true, register }),
    getByParams: jest.fn().mockResolvedValue(pagination),
    update: jest.fn().mockResolvedValue(resolveData),
    delete: jest.fn().mockResolvedValue(resolveData),
    checkOut: jest.fn().mockResolvedValue({ ok: true, registerCheckOutDetail }),
    checkIn: jest
      .fn()
      .mockResolvedValue({ register, guests: [guest], ok: true }),
  };

  it('should have been call with parameters (getAll)', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };

    const registerService = new RegisterService(mockRegisterDatasource);

    await registerService.getAll(paginationDto);

    expect(mockRegisterDatasource.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  it('should have been call with parameters (getById)', async () => {
    const id = Uuid.v4();
    const registerService = new RegisterService(mockRegisterDatasource);

    await registerService.getById(id);

    expect(mockRegisterDatasource.getById).toHaveBeenCalledWith(id);
  });

  it('should have been call with parameters (checkIn)', async () => {
    const registerDto = { roomId: Uuid.v4() } as CreateRegisterDto;
    const guestDtos = [] as CreateGuestDto[];

    const mockRegisterDatasource = {
      getByParams: jest
        .fn()
        .mockResolvedValue({ ...pagination, registers: [] }),
      checkIn: jest
        .fn()
        .mockResolvedValue({ ok: true, register, guests: [guest] }),
    } as unknown as RegisterDatasource;

    const registerService = new RegisterService(mockRegisterDatasource);

    await registerService.checkIn({ guestDtos, registerDto });

    expect(mockRegisterDatasource.checkIn).toHaveBeenCalledWith({
      registerDto,
      guestDtos,
    });
  });

  it('should throw error if guests di are duplicated (checkIn)', async () => {
    const registerDto = {} as CreateRegisterDto;
    const guestDtos = [
      { di: '1234567890' },
      { di: '1234567890' },
    ] as CreateGuestDto[];

    const mockRegisterDatasource = {
      checkIn: jest.fn(),
    } as unknown as RegisterDatasource;

    const registerService = new RegisterService(mockRegisterDatasource);

    try {
      await registerService.checkIn({ registerDto, guestDtos });
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(mockRegisterDatasource.checkIn).not.toHaveBeenCalled();
      expect(error.message).toBe(
        `di duplicate values found: ${guestDtos[0].di}`
      );
    }
  });

  it('should have been call with parameters (checkOut)', async () => {
    const id = Uuid.v4();

    const registerService = new RegisterService(mockRegisterDatasource);

    await registerService.checkOut(id);

    expect(mockRegisterDatasource.checkOut).toHaveBeenCalledWith(id);
  });

  it('should have been call with parameters (update)', async () => {
    const registerService = new RegisterService(mockRegisterDatasource);

    await registerService.update({ id: register.id });

    expect(mockRegisterDatasource.update).toHaveBeenCalledWith({
      id: register.id,
    });
  });

  it('should have been call with parameters (delete)', async () => {
    const id = Uuid.v4();

    const registerService = new RegisterService(mockRegisterDatasource);

    await registerService.delete(id);

    expect(mockRegisterDatasource.delete).toHaveBeenCalledWith(id);
  });
});
