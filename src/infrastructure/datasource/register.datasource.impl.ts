import { Register } from '@prisma/client';

import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { CustomError } from '@domain/error';
import { RegisterDatasource } from '@domain/datasources';
import { GuestEntity, RegisterEntity } from '@domain/entities';
import { RegisterPagination, IRegister } from '@domain/interfaces';

import { LoggerService } from '@presentation/services';

import { cleanObject, pagination } from '@src/utils';
import { prisma } from '@src/data/postgres';
import { CreateGuestDto } from '@src/domain/dtos/guest';

export class RegisterDatasourceImpl extends RegisterDatasource {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  private handleError(error: any) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      this.logger.error((error as Error).message);
      throw CustomError.internalServerError(`internal server error`);
    }
  }

  private transformObject(entity: Register): RegisterEntity {
    return RegisterEntity.fromObject({
      ...entity,
      checkIn: entity.checkIn.toISOString(),
      checkOut: entity.checkOut?.toISOString() ?? null,
    });
  }

  private async checkGuestsCountryIds(guestDtos: CreateGuestDto[]) {
    const countries = await prisma.country.findMany({ select: { id: true } });

    for (const guest of guestDtos) {
      // if (!countries.some(({ id }) => id === guest.countryId)) {
      if (!countries.find((country) => country.id === guest.countryId)) {
        throw CustomError.badRequest(
          `Country with id ${guest.countryId} not found`
        );
      }
    }
  }

  private async createCheckIn({
    guestDtos,
    registerDto,
  }: {
    registerDto: CreateRegisterDto;
    guestDtos: CreateGuestDto[];
  }) {
    const checkInTx = await prisma.$transaction(async (tx) => {
      // * 1 create register
      const newRegister = await tx.register.create({
        data: { ...registerDto, guestsNumber: guestDtos.length },
      });
      const register = this.transformObject(newRegister);

      // * 2 create guests
      await prisma.guest.createMany({
        data: guestDtos.map((guestDto) => ({
          ...guestDto,
          registerId: register.id,
        })),
      });

      const guestsDB = await tx.guest.findMany({
        where: { registerId: register.id },
      });
      const guests = guestsDB.map(GuestEntity.fromObject);
      return { register, guests };
    });

    return checkInTx;
  }

  async getById(
    id: string
  ): Promise<{ ok: boolean; register: RegisterEntity }> {
    try {
      const register = await prisma.register.findUnique({ where: { id } });

      if (!register) {
        throw CustomError.notFound(`register with id ${id} not found`);
      }

      return { ok: true, register: this.transformObject(register) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getByParam(
    searchParam: Partial<Pick<IRegister, keyof IRegister>>
  ): Promise<{ ok: boolean; register: RegisterEntity | null }> {
    try {
      const register = await prisma.register.findFirst({ where: searchParam });

      if (!register) {
        return { ok: true, register: null };
      }

      return { ok: true, register: this.transformObject(register) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAll(page: number, limit: number): Promise<RegisterPagination> {
    try {
      const [total, registersDb] = await Promise.all([
        prisma.register.count(),
        prisma.register.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const registers = registersDb.map((register) =>
        this.transformObject(register)
      );

      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'register',
      });

      return { page, limit, total, next, prev, registers };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    createRegisterDto: CreateRegisterDto
  ): Promise<{ ok: boolean; register: RegisterEntity }> {
    const { guestsNumber, ...rest } = createRegisterDto;
    if (!guestsNumber) {
      throw CustomError.badRequest('guestsNumber property is required');
    }

    try {
      const newRegister = await prisma.register.create({
        data: { ...rest, guestsNumber },
      });

      return { ok: true, register: this.transformObject(newRegister) };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // todo make CreateRegisterDto.guestsNumber as optional
  // todo make CreateGuestDto.registerId as optional

  async checkIn(data: {
    registerDto: CreateRegisterDto;
    guestDtos: CreateGuestDto[];
  }): Promise<{
    ok: boolean;
    register: RegisterEntity;
    guests: GuestEntity[];
  }> {
    try {
      await this.checkGuestsCountryIds(data.guestDtos);

      const checkInTx = await this.createCheckIn(data);
      return { ok: true, ...checkInTx };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(
    updaterRegisterDto: UpdateRegisterDto
  ): Promise<{ ok: boolean; message: string }> {
    const { id, ...rest } = updaterRegisterDto;

    await this.getById(id);
    const data = cleanObject(rest);

    try {
      await prisma.register.update({ where: { id }, data });
      return { ok: true, message: 'register updated successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<{ ok: boolean; message: string }> {
    await this.getById(id);

    try {
      await prisma.register.delete({ where: { id } });

      return { ok: true, message: 'register deleted successfully' };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}
