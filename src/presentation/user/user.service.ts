import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { PaginationDto } from '../../domain/dtos/share';
import { UserRepository } from '../../domain/repositories';
import { CustomError } from '../../domain/error';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(paginationDto: PaginationDto, isActive?: boolean) {
    const { page, limit } = paginationDto;
    return this.userRepository.getAll(page, limit, isActive);
  }

  async getById(id: string) {
    return this.userRepository.getById(id);
  }

  async create(createUserDto: CreateUserDto) {
    const { user } = await this.userRepository.getByParam({
      username: createUserDto.username,
    });

    if (user) {
      throw CustomError.conflict(
        `username ${createUserDto.username} duplicated`
      );
    }

    return this.userRepository.create(createUserDto);
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto);
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }
}
