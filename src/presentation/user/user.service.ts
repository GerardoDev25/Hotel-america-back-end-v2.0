import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { PaginationDto } from '../../domain/dtos/share';
import { UserRepository } from '../../domain/repositories';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(paginationDto: PaginationDto, isAvailable?: boolean) {
    const { page, limit } = paginationDto;
    return this.userRepository.getAll(page, limit, isAvailable);
  }

  async getById(id: string) {
    return this.userRepository.getById(id);
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto);
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }
}
