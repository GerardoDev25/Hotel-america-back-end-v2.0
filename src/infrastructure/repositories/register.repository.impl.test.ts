import { CreateGuestDto } from '@domain/dtos/guest';
import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { RegisterDatasource } from '@domain/datasources';
import { variables } from '@domain/variables';

import { Uuid } from '@src/adapters';

import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { RegisterRepositoryImpl } from '.';

describe('register.repository.impl.ts', () => {
  const mockDataSource: RegisterDatasource = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParam: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
  };

  const repository = new RegisterRepositoryImpl(mockDataSource);

  beforeEach(() => jest.clearAllMocks());

  it('should call getById', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(mockDataSource.getById).toHaveBeenCalled();
    expect(mockDataSource.getById).toHaveBeenCalledWith(id);
  });

  it('should call getByParam', async () => {
    const roomId = Uuid.v4();
    await repository.getByParam({ roomId });

    expect(mockDataSource.getByParam).toHaveBeenCalled();
    expect(mockDataSource.getByParam).toHaveBeenCalledWith({ roomId });
  });

  it('should call getAll', async () => {
    const page = 2;
    const limit = 10;

    await repository.getAll(page, limit);

    expect(mockDataSource.getAll).toHaveBeenCalled();
    expect(mockDataSource.getAll).toHaveBeenCalledWith(page, limit);
  });

  it('should call create', async () => {
    const createRegister: CreateRegisterDto = {
      guestsNumber: variables.GUESTS_NUMBER_MIN_VALUE,
      discount: 0,
      price: 0,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    await repository.create(createRegister);

    expect(mockDataSource.create).toHaveBeenCalled();
    expect(mockDataSource.create).toHaveBeenCalledWith(createRegister);
  });

  it('should call checkIn', async () => {
    const createRegister: CreateRegisterDto = {
      guestsNumber: variables.GUESTS_NUMBER_MIN_VALUE,
      discount: 0,
      price: 0,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const fullName = Generator.randomName();
    const guestDto: CreateGuestDto = {
      di: Generator.randomIdentityNumber(),
      city: Generator.randomCity(citiesList),
      name: fullName.split(' ').at(0)!,
      lastName: fullName.split(' ').at(1)!,
      phone: Generator.randomPhone(),
      roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
      countryId: Uuid.v4(),
      registerId: Uuid.v4(),
      dateOfBirth: new Date(),
    };

    const data = { registerDto: createRegister, guestDtos: [guestDto] };

    await repository.checkIn(data);

    expect(mockDataSource.checkIn).toHaveBeenCalled();
    expect(mockDataSource.checkIn).toHaveBeenCalledWith(data);
  });

  it('should call checkOut', async () => {
    const id = Uuid.v4();
    await repository.checkOut(id);

    expect(mockDataSource.checkOut).toHaveBeenCalled();
    expect(mockDataSource.checkOut).toHaveBeenCalledWith(id);
  });

  it('should call update', async () => {
    const updateRegister: UpdateRegisterDto = {
      id: Uuid.v4(),
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
      guestsNumber: 0,
      discount: 0,
      price: 0,
      checkOut: new Date(),
    };

    await repository.update(updateRegister);

    expect(mockDataSource.update).toHaveBeenCalled();
    expect(mockDataSource.update).toHaveBeenCalledWith(updateRegister);
  });

  it('should call delete', async () => {
    const id = Uuid.v4();
    await repository.delete(id);

    expect(mockDataSource.delete).toHaveBeenCalled();
    expect(mockDataSource.delete).toHaveBeenCalledWith(id);
  });
});
