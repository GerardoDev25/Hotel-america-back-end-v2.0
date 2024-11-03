import { CreateUserDto, UpdateUserDto } from '@domain/dtos/user';
import { PaginationDto } from '@domain/dtos/share';

import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';

import { UserService } from './user.service';
import { UserDatasource } from '@src/domain/datasources';

describe('user.service.ts', () => {
  const mockUserDatasource = {
    update: jest.fn(),
    delete: jest.fn(),
    getByParams: jest.fn().mockResolvedValue({ ok: true, users: [] }),
    getAll: jest.fn().mockResolvedValue({ ok: true, users: [] }),
    getAllActive: jest.fn().mockResolvedValue({ ok: true, users: [] }),
    getById: jest
      .fn()
      .mockResolvedValue({ ok: true, user: { password: '123' } }),
    create: jest
      .fn()
      .mockResolvedValue({ ok: true, user: { password: '123' } }),
  } as unknown as UserDatasource;

  it('should to have been called with parameter (getAll)', async () => {
    const isActive = undefined;
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new UserService(mockUserDatasource);

    await service.getAll(paginationDto, isActive);

    expect(mockUserDatasource.getAll).toHaveBeenCalledTimes(1);
    expect(mockUserDatasource.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit
    );
  });

  it('should to have been called with parameter (getAllActive)', async () => {
    const isActive = true;
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new UserService(mockUserDatasource);

    await service.getAll(paginationDto, isActive);

    expect(mockUserDatasource.getAllActive).toHaveBeenCalledTimes(1);
    expect(mockUserDatasource.getAllActive).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      isActive
    );
  });

  it('should to have been called with parameter (getByParams)', async () => {
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const params = { isActive: true, name: 'test', birdDate: new Date() };
    const service = new UserService(mockUserDatasource);

    await service.getByParams(paginationDto, params);

    expect(mockUserDatasource.getByParams).toHaveBeenCalledTimes(1);
    expect(mockUserDatasource.getByParams).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      params
    );
  });

  it('should to have been called with parameter (getById)', async () => {
    const id = Uuid.v4();
    const service = new UserService(mockUserDatasource);

    await service.getById(id);

    expect(mockUserDatasource.getById).toHaveBeenCalledTimes(1);
    expect(mockUserDatasource.getById).toHaveBeenCalledWith(id);
  });

  it('should to have been called with parameter (create)', async () => {
    const [errors, user] = CreateUserDto.create({
      birdDate: Generator.randomDate(),
      name: Generator.randomName(),
      password: Generator.randomPassword(),
      phone: Generator.randomPhone(),
      username: Generator.randomUsername(),
      role: 'admin',
      isActive: true,
    });
    const service = new UserService(mockUserDatasource);

    await service.create(user!);

    expect(errors).toBeUndefined();
    expect(mockUserDatasource.create).toHaveBeenCalledTimes(1);
    expect(mockUserDatasource.create).toHaveBeenCalledWith(user);
  });

  it('should to have been called with parameter (update)', async () => {
    const [errors, user] = UpdateUserDto.create({
      id: Uuid.v4(),
      birdDate: Generator.randomDate(),
      name: Generator.randomName(),
      password: Generator.randomPassword(),
      phone: Generator.randomPhone(),
      username: Generator.randomUsername(),
      role: 'admin',
      isActive: true,
    });
    const service = new UserService(mockUserDatasource);
    await service.update(user!);

    expect(errors).toBeUndefined();
    expect(mockUserDatasource.update).toHaveBeenCalledTimes(1);
    expect(mockUserDatasource.update).toHaveBeenCalledWith(user);
  });

  it('should to have been called with parameter (delete)', async () => {
    const id = Uuid.v4();
    const service = new UserService(mockUserDatasource);
    await service.delete(id);

    expect(mockUserDatasource.delete).toHaveBeenCalledTimes(1);
    expect(mockUserDatasource.delete).toHaveBeenCalledWith(id);
  });
});
