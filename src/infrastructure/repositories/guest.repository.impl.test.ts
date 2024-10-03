import { GuestDatasource } from '@src/domain/datasources';
import { CreateGuestDto, UpdateGuestDto } from '@domain/dtos/guest';
import { Uuid } from '@src/adapters';
import { GuestRepositoryImpl } from '.';

describe('guest.repository.impl.ts', () => {
  const mockDataSource: GuestDatasource = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParam: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const repository = new GuestRepositoryImpl(mockDataSource);

  beforeEach(() => jest.clearAllMocks());

  test('should call (getById)', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(mockDataSource.getById).toHaveBeenCalled();
    expect(mockDataSource.getById).toHaveBeenCalledWith(id);
  });

  test('should call (getByParam)', async () => {
    const dateOfBirth = '';
    await repository.getByParam({ dateOfBirth });

    expect(mockDataSource.getByParam).toHaveBeenCalled();
    expect(mockDataSource.getByParam).toHaveBeenCalledWith({ dateOfBirth });
  });

  test('should call getAll', async () => {
    const page = 2;
    const limit = 10;

    await repository.getAll(page, limit);

    expect(mockDataSource.getAll).toHaveBeenCalled();
    expect(mockDataSource.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call create', async () => {
    const createGuest: CreateGuestDto = {
      di: '',
      city: '',
      name: '',
      lastName: '',
      phone: '',
      roomNumber: 0,
      countryId: '',
      registerId: '',
      dateOfBirth: new Date(),
    };

    await repository.create(createGuest);

    expect(mockDataSource.create).toHaveBeenCalled();
    expect(mockDataSource.create).toHaveBeenCalledWith(createGuest);
  });

  test('should call (update)', async () => {
    const updateGuest: UpdateGuestDto = {
      id: Uuid.v4(),
      di: '',
      city: '',
      name: '',
      lastName: '',
      phone: '',
      roomNumber: 0,
      countryId: '',
      registerId: '',
      dateOfBirth: new Date(),
    };

    await repository.update(updateGuest);

    expect(mockDataSource.update).toHaveBeenCalled();
    expect(mockDataSource.update).toHaveBeenCalledWith(updateGuest);
  });

  test('should call (delete)', async () => {
    const id = Uuid.v4();
    await repository.delete(id);

    expect(mockDataSource.delete).toHaveBeenCalled();
    expect(mockDataSource.delete).toHaveBeenCalledWith(id);
  });
});
