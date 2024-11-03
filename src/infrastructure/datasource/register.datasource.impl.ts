import { Guest, Register } from '@prisma/client';
import { CustomError } from '@domain/error';
import { RegisterDatasource } from '@domain/datasources';
import { GuestEntity, RegisterEntity } from '@domain/entities';
import {
  RegisterPagination,
  RegisterCheckOut,
  RegisterCheckOutDB,
  IRegisterFilterDto,
} from '@domain/interfaces';
import {
  CreateGuestDto,
  CreateRegisterDto,
  FilterRegisterDto,
  UpdateRegisterDto,
} from '@domain/dtos';

import { LoggerService } from '@presentation/services';

import { cleanObject, HandleDate, pagination } from '@src/utils';
import { prisma } from '@src/data/postgres';

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
      checkOut: entity.checkOut?.toISOString() ?? undefined,
    });
  }

  private checkOutObject(checkOutDB: RegisterCheckOutDB): RegisterCheckOut {
    const checkIn = checkOutDB.checkIn.toISOString().split('T').at(0);
    const checkOut = checkOutDB.checkOut!.toISOString().split('T').at(0);

    const guests = checkOutDB.Guest.map((guest) => ({
      ...guest,
      country: guest.country.name,
      dateOfBirth: guest.dateOfBirth.toISOString().split('T').at(0)!,
    }));

    const charges = checkOutDB.Charge.map((charge) => ({
      ...charge,
      createdAt: charge.createdAt.toISOString().split('T').at(0)!,
    }));

    const payments = checkOutDB.Payment.map((payment) => ({
      ...payment,
      paidAt: payment.paidAt.toISOString().split('T').at(0)!,
    }));

    const checkOutDetail: RegisterCheckOut = {
      ...checkOutDB,
      guests,
      charges,
      payments,
      checkOut,
      checkIn: checkIn!,
      roomNumber: checkOutDB.room.roomNumber,
    };

    return checkOutDetail;
  }

  private transformGuestObject(entities: Guest[]): GuestEntity[] {
    const guestEntities = entities.map((guest) =>
      GuestEntity.fromObject({
        ...guest,
        checkIn: guest.checkIn.toISOString(),
        dateOfBirth: guest.dateOfBirth.toISOString(),
        checkOut: guest.checkOut?.toISOString() ?? undefined,
      })
    );

    return guestEntities;
  }

  private async checkGuestsCountryIds(guestDtos: CreateGuestDto[]) {
    const countries = await prisma.country.findMany({ select: { id: true } });

    for (const guest of guestDtos) {
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
      const newRegister = await tx.register.create({
        data: {
          ...registerDto,
          guestsNumber: guestDtos.length,
          Guest: {
            createMany: {
              data: guestDtos.map((guestDto) => ({
                ...guestDto,
              })),
            },
          },
          Charge: {
            create: {
              amount: registerDto.price,
              description: 'lodging charge',
              type: 'lodging',
            },
          },
        },
      });

      const guestsDB = await tx.guest.findMany({
        where: { registerId: newRegister.id },
      });

      const register = this.transformObject(newRegister);
      const guests = this.transformGuestObject(guestsDB);
      return { register, guests };
    });

    return checkInTx;
  }

  private async makeCheckOut(id: string) {
    const checkOut = await prisma.$transaction(async (tx) => {
      // * 1 get register information
      const registerToDelete = await tx.register.findUnique({
        where: { id },
        select: {
          id: true,
          checkIn: true,
          checkOut: true,
          discount: true,
          price: true,
          room: { select: { roomNumber: true } },
          Charge: {
            select: { amount: true, description: true, createdAt: true },
          },
          Payment: {
            select: { amount: true, description: true, paidAt: true },
          },
          Guest: {
            select: {
              di: true,
              dateOfBirth: true,
              city: true,
              name: true,
              lastName: true,
              phone: true,
              country: { select: { name: true } },
            },
          },
        },
      });

      if (!registerToDelete) {
        throw CustomError.notFound(`Register with id ${id} not found`);
      }

      const totalCharges = registerToDelete.Charge.reduce(
        (total, charge) => total + charge.amount,
        0
      );

      const totalPayments = registerToDelete.Payment.reduce(
        (total, payment) => total + payment.amount,
        0
      );

      const discount = registerToDelete?.discount ?? 0;
      if (totalCharges !== totalPayments + discount) {
        throw CustomError.conflict(
          `The total charges: (${totalCharges}) must be equal to the total payments plus discount: (${totalPayments + discount})`
        );
      }

      // * delete charges, payments, guests and register
      await Promise.all([
        tx.charge.deleteMany({ where: { registerId: id } }),
        tx.payment.deleteMany({ where: { registerId: id } }),
        tx.guest.deleteMany({ where: { registerId: id } }),
      ]);
      await tx.register.delete({ where: { id } });

      return { ...registerToDelete, totalCharges, totalPayments };
    });

    return checkOut;
  }

  async getByParams(
    page: number,
    limit: number,
    searchParam: FilterRegisterDto
  ): Promise<RegisterPagination> {
    try {
      const where: IRegisterFilterDto = cleanObject(searchParam);
      if (searchParam.checkIn)
        where.checkIn = {
          gte: searchParam.checkIn,
          lt: HandleDate.nextDay(searchParam.checkIn),
        };

      if (searchParam.checkOut)
        where.checkOut = {
          gte: searchParam.checkOut,
          lt: HandleDate.nextDay(searchParam.checkOut),
        };

      const [totalDB, registersDb] = await Promise.all([
        prisma.register.count({ where }),
        prisma.register.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
        }),
      ]);

      const registers = registersDb.map((register) =>
        this.transformObject(register)
      );
      const total = registersDb.length === 0 ? 0 : totalDB;
      const { next, prev } = pagination({
        page,
        limit,
        total,
        path: 'register/get-by-params',
      });

      return { page, limit, total, next, prev, registers };
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

  async checkIn(data: {
    registerDto: CreateRegisterDto;
    guestDtos: CreateGuestDto[];
  }): Promise<{
    ok: boolean;
    register: RegisterEntity;
    guests: GuestEntity[];
  }> {
    const registerDto = cleanObject(data.registerDto) as CreateRegisterDto;
    const guestDtos = data.guestDtos.map((guest) =>
      cleanObject(guest)
    ) as CreateGuestDto[];

    try {
      await this.checkGuestsCountryIds(guestDtos);

      const checkInTx = await this.createCheckIn({ registerDto, guestDtos });
      return { ok: true, ...checkInTx };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async checkOut(
    id: string
  ): Promise<{ ok: boolean; registerCheckOutDetail: RegisterCheckOut }> {
    // ? verify register exist and have checkOut date
    try {
      const { ok, register } = await this.getById(id);
      if (ok && !register.checkOut) {
        await prisma.register.update({
          where: { id },
          data: { checkOut: new Date() },
        });
      }
    } catch (error: any) {
      throw this.handleError(error);
    }

    // ? do checkOut
    try {
      const checkOut = await this.makeCheckOut(id);
      const registerCheckOutDetail = this.checkOutObject(checkOut!);
      return { ok: true, registerCheckOutDetail };
    } catch (error: any) {
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
