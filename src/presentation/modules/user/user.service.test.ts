import { CreateUserDto, UpdateUserDto } from '../../../domain/dtos/user';
import { PaginationDto } from '../../../domain/dtos/share';
import { UserRepository } from '../../../domain/repositories';
import { UserService } from './user.service';
import { Uuid } from '../../../adapters';
import { Generator } from '../../../utils/generator';

describe('user.service.ts', () => {
  const mockUserRepository = {
    update: jest.fn(),
    delete: jest.fn(),
    getByParam: jest.fn().mockReturnValue({ ok: true, user: false }),
    getAll: jest.fn().mockResolvedValue({ ok: true, users: [] }),
    getById: jest
      .fn()
      .mockResolvedValue({ ok: true, user: { password: '123' } }),
    create: jest
      .fn()
      .mockResolvedValue({ ok: true, user: { password: '123' } }),
  } as unknown as UserRepository;

  it('should to have been called with parameter (getAll)', async () => {
    const isActive = true;
    const paginationDto = { page: 1, limit: 10 } as PaginationDto;
    const service = new UserService(mockUserRepository);

    await service.getAll(paginationDto, isActive);

    expect(mockUserRepository.getAll).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getAll).toHaveBeenCalledWith(
      paginationDto.page,
      paginationDto.limit,
      isActive
    );
  });

  it('should to have been called with parameter (getById)', async () => {
    const id = Uuid.v4();
    const service = new UserService(mockUserRepository);

    await service.getById(id);

    expect(mockUserRepository.getById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(id);
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
    const service = new UserService(mockUserRepository);

    await service.create(user!);

    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.create).toHaveBeenCalledWith(user);

    expect(mockUserRepository.getByParam).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getByParam).toHaveBeenCalledWith({
      username: user!.username,
    });
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
    const service = new UserService(mockUserRepository);
    await service.update(user!);

    expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.update).toHaveBeenCalledWith(user);
  });

  it('should to have been called with parameter (delete)', async () => {
    const id = Uuid.v4();
    const service = new UserService(mockUserRepository);
    await service.delete(id);

    expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
  });
});
