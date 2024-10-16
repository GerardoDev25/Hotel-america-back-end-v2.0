import { CreateUserDto, FilterUserDto, UpdateUserDto } from '@domain/dtos/user';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { UserRepository } from '@domain/repositories';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private handleError(error: unknown) {
    if (error instanceof CustomError) throw error;
    throw CustomError.internalServerError('Internal Server Error');
  }

  async getAll(paginationDto: PaginationDto, isActive?: boolean) {
    const { page, limit } = paginationDto;

    try {
      const { users, ...rest } = await this.userRepository.getAll(
        page,
        limit,
        isActive
      );

      const usersMapped = users.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restUser } = user;
        return restUser;
      });

      return { ...rest, users: usersMapped };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterRoomDto: FilterUserDto
  ) {
    const { page, limit } = paginationDto;
    try {
      const { users, ...rest } = await this.userRepository.getByParams(
        page,
        limit,
        filterRoomDto
      );

      const usersMapped = users.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restUser } = user;
        return restUser;
      });

      return { ...rest, users: usersMapped };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string) {
    try {
      const { ok, user } = await this.userRepository.getById(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;

      return { ok, user: { ...rest } };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    // const { users } = await this.userRepository.getByParams(1, 1, {
    //   username: createUserDto.username,
    // });

    // if (users.length > 1) {
    //   throw CustomError.conflict(
    //     `username ${createUserDto.username} duplicated`
    //   );
    // }

    try {
      const { ok, user } = await this.userRepository.create(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;

      return { ok, user: { ...rest } };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto);
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }
}
