import { Uuid } from '../../adapters';
import { RegisterDatasource } from '../../domain/datasources';
import {
  CreateRegisterDto,
  UpdateRegisterDto,
} from '../../domain/dtos/register';
import { RegisterRepositoryImpl } from './register.repository.impl';

describe('register.repository.impl.ts', () => {
  const mockDataSource: RegisterDatasource = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByParam: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const repository = new RegisterRepositoryImpl(mockDataSource);

  beforeEach(() => jest.clearAllMocks());

  test('should call getById', async () => {
    const id = Uuid.v4();
    await repository.getById(id);

    expect(mockDataSource.getById).toHaveBeenCalled();
    expect(mockDataSource.getById).toHaveBeenCalledWith(id);
  });

  test('should call getByParam', async () => {
    const roomId = Uuid.v4();
    await repository.getByParam({ roomId });

    expect(mockDataSource.getByParam).toHaveBeenCalled();
    expect(mockDataSource.getByParam).toHaveBeenCalledWith({ roomId });
  });

  test('should call getAll', async () => {
    const page = 2;
    const limit = 10;

    await repository.getAll(page, limit);

    expect(mockDataSource.getAll).toHaveBeenCalled();
    expect(mockDataSource.getAll).toHaveBeenCalledWith(page, limit);
  });

  test('should call create', async () => {
    const createRegister: CreateRegisterDto = {
      guestsNumber: 0,
      discount: 0,
      price: 0,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
      checkIn: new Date(),
    };

    await repository.create(createRegister);

    expect(mockDataSource.create).toHaveBeenCalled();
    expect(mockDataSource.create).toHaveBeenCalledWith(createRegister);
  });

  test('should call update', async () => {
    const updateRegister: UpdateRegisterDto = {
      id: Uuid.v4(),
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
      guestsNumber: 0,
      discount: 0,
      price: 0,
      checkIn: new Date(),
      checkOut: new Date(),
    };

    await repository.update(updateRegister);

    expect(mockDataSource.update).toHaveBeenCalled();
    expect(mockDataSource.update).toHaveBeenCalledWith(updateRegister);
  });

  test('should call delete', async () => {
    const id = Uuid.v4();
    await repository.delete(id);

    expect(mockDataSource.delete).toHaveBeenCalled();
    expect(mockDataSource.delete).toHaveBeenCalledWith(id);
  });
});
