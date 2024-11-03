import request from 'supertest';
import { BcryptAdapter, JwtAdapter } from '@src/adapters';
import { prisma } from '@src/data/postgres';
import { citiesList } from '@src/data/seed';
import { CreateRegisterDto, CreateRoomDto } from '@domain/dtos';
import { testServer } from '@src/test-server';
import { Generator } from '@src/utils/generator';
import { HandleDate } from '@src/utils';
import {
  StringValidator,
  BooleanValidator,
  NumberValidator,
} from '@domain/type-validators';

describe('cafeteria.route.ts', () => {
  let token: string;
  const fullName = Generator.randomName();

  const tokenUser = {
    role: 'cafe',
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'token@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  const rawUser = {
    role: 'cafe',
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'JohnDoe@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  const rawRoom: CreateRoomDto = {
    roomType: 'suit',
    state: 'free',
    roomNumber: 100,
    betsNumber: 2,
    isAvailable: true,
  };

  const rawRegister: CreateRegisterDto = {
    guestsNumber: 2,
    price: 0,
    checkOut: new Date(),
    discount: 0,
    userId: '',
    roomId: '',
  };

  const rawCountry = {
    name: 'Colombia',
    id: 'CO',
  };

  const rawGuest = {
    di: Generator.randomIdentityNumber(),
    city: Generator.randomCity(citiesList).trim().toLowerCase(),
    name: fullName.split(' ').at(0)!.trim().toLowerCase(),
    lastName: fullName.split(' ').at(1)!.trim().toLowerCase(),
    phone: Generator.randomPhone().trim(),
    countryId: rawCountry.id.trim(),
    dateOfBirth: new Date(),
    checkOut: new Date(),
  };

  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.cafeteria.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.register.deleteMany();
    await prisma.room.deleteMany();
    await prisma.country.deleteMany();
    await prisma.user.deleteMany();

    // * create auth token
    const user = await prisma.user.create({ data: tokenUser as any });
    token = await JwtAdapter.generateToken({ payload: { id: user.id } });
  });

  it('should get all cafeteria records (getAll)', async () => {
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser as any }),
      await prisma.room.create({ data: rawRoom }),
    ]);

    await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
        Guest: {
          create: {
            ...rawGuest,
            countryId: country.id,
            roomNumber: room.roomNumber,
            Cafeteria: {
              createMany: {
                data: [
                  { isServed: true },
                  { isServed: true },
                  { isServed: false },
                  {
                    isServed: false,
                    createdAt: HandleDate.nextDay(new Date()),
                  },
                ],
              },
            },
          },
        },
      },
    });
    const todayTime = new Date().toISOString().split('T')[0];

    const { body } = await request(testServer.app)
      .get('/api/cafeteria')
      .expect(200);

    expect(body.ok).toBe(true);

    for (const item of body.items) {
      expect(StringValidator.isValidUUID(item.id)).toBeTruthy();
      expect(item.createdAt).toBe(todayTime);
      expect(typeof item.guestName).toBe('string');
      expect(StringValidator.isValidUUID(item.guestId)).toBeTruthy();
      expect(BooleanValidator.isValid(item.isServed)).toBeTruthy();
      expect(NumberValidator.isValid(item.roomNumber)).toBeTruthy();
    }
  });

  it('should update a record (update)', async () => {
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser as any }),
      await prisma.room.create({ data: rawRoom }),
    ]);

    await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
        Guest: {
          create: {
            ...rawGuest,
            countryId: country.id,
            roomNumber: room.roomNumber,
            Cafeteria: { createMany: { data: [{ isServed: false }] } },
          },
        },
      },
    });

    const record = await prisma.cafeteria.findFirst();

    const { body } = await request(testServer.app)
      .put('/api/cafeteria')
      .send({ id: record!.id, isServed: true })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body).toEqual({ ok: true, message: 'record updated successfully' });

    const recordUpdated = await prisma.cafeteria.findFirst({
      where: { id: record?.id },
    });

    expect(recordUpdated?.isServed).toBeTruthy();
  });

  it('should get error if no pass object (update)', async () => {
    const { body } = await request(testServer.app)
      .put('/api/cafeteria')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['id property is required', 'isServed property is required'],
    });
  });

  it('should get error if  pass invalid object (update)', async () => {
    const { body } = await request(testServer.app)
      .put('/api/cafeteria')
      .send({ id: 'invalid-id', isServed: 'invalid-value' })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['id is not a valid uuid', 'isServed property most be a boolean'],
    });
  });

  it('should get error is not auth (update)', async () => {
    const { body } = await request(testServer.app)
      .put('/api/cafeteria')
      .expect(401);

    expect(body).toEqual({
      ok: false,
      errors: ['Token not provided'],
    });
  });
});
