import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { PaginationDto } from '../../domain/dtos/share';
import { UserRepository } from '../../domain/repositories';
import { UserService } from './user.service';
import { Uuid } from '../../adapters';
import {
  generateRandomDate,
  generateRandomName,
  generateRandomPassword,
  generateRandomPhone,
  generateRandomUsername,
} from '../../utils/generator';

describe('user.service.ts', () => {
  const mockUserRepository = {
    getByParam: jest.fn().mockReturnValue({ ok: true, user: false }),
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
    const user = CreateUserDto.create({
      birdDate: generateRandomDate(),
      name: generateRandomName(),
      password: generateRandomPassword(),
      phone: generateRandomPhone(),
      role: 'admin',
      username: generateRandomUsername(),
      isActive: true,
    });
    const service = new UserService(mockUserRepository);

    await service.create(user);

    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.create).toHaveBeenCalledWith(user);

    expect(mockUserRepository.getByParam).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.getByParam).toHaveBeenCalledWith({
      username: user.username,
    });
  });

  it('should to have been called with parameter (update)', async () => {
    const user = UpdateUserDto.create({
      id: Uuid.v4(),
      birdDate: generateRandomDate(),
      name: generateRandomName(),
      password: generateRandomPassword(),
      phone: generateRandomPhone(),
      role: 'admin',
      username: generateRandomUsername(),
      isActive: true,
    });
    const service = new UserService(mockUserRepository);
    await service.update(user);

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
