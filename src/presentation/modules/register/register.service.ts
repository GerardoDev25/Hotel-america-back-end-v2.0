import { CustomError } from '@domain/error';
import {
  PaginationDto,
  CreateGuestDto,
  CreateRegisterDto,
  FilterRegisterDto,
  UpdateRegisterDto,
} from '@domain/dtos';
import { RegisterDatasource, RoomDatasource } from '@domain/datasources';

export class RegisterService {
  constructor(
    private readonly registerDatasource: RegisterDatasource,
    private readonly roomDatasource: RoomDatasource
  ) {}

  private handleError(error: unknown) {
    if (error instanceof CustomError) throw error;
    throw CustomError.internalServerError('Internal Server Error');
  }

  async getAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.registerDatasource.getAll(page, limit);
  }

  async getByParams(
    paginationDto: PaginationDto,
    filterRegisterDto: FilterRegisterDto
  ) {
    const { page, limit } = paginationDto;
    return this.registerDatasource.getByParams(page, limit, filterRegisterDto);
  }

  async getById(id: string) {
    return this.registerDatasource.getById(id);
  }

  create = async (createRegisterDto: CreateRegisterDto) => {
    const page = 1;
    const limit = 1;

    try {
      const [{ room }, { registers }] = await Promise.all([
        this.roomDatasource.getById(createRegisterDto.roomId),
        this.registerDatasource.getByParams(page, limit, {
          roomId: createRegisterDto.roomId,
        }),
      ]);

      if (!room.isAvailable || registers[0]) {
        throw CustomError.conflict(
          `room with id ${createRegisterDto.roomId} is not available`
        );
      }
    } catch (error) {
      throw this.handleError(error);
    }

    return this.registerDatasource.create(createRegisterDto);
  };
  async checkIn(data: {
    registerDto: CreateRegisterDto;
    guestDtos: CreateGuestDto[];
  }) {
    const { registerDto } = data;
    const page = 1;
    const limit = 1;
    try {
      const [{ room }, { registers }] = await Promise.all([
        this.roomDatasource.getById(registerDto.roomId),
        this.registerDatasource.getByParams(page, limit, {
          roomId: registerDto.roomId,
        }),
      ]);

      if (!room.isAvailable || registers[0]) {
        throw CustomError.conflict(
          `room with id ${registerDto.roomId} is not available`
        );
      }
    } catch (error) {
      throw this.handleError(error);
    }

    return this.registerDatasource.checkIn(data);
  }

  async checkOut(id: string) {
    return this.registerDatasource.checkOut(id);
  }

  async update(updateRegisterDto: UpdateRegisterDto) {
    return this.registerDatasource.update(updateRegisterDto);
  }

  async delete(id: string) {
    return this.registerDatasource.delete(id);
  }
}
