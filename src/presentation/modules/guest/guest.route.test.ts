import request from 'supertest';
import { BcryptAdapter, JwtAdapter, Uuid } from '@src/adapters';
import { prisma } from '@src/data/postgres';
import { CreateRegisterDto } from '@src/domain/dtos/register';
import { CreateRoomDto } from '@src/domain/dtos/room';
import { RoomTypesList, UserRolesList } from '@src/domain/interfaces';
import { testServer } from '@src/test-server';
import { Generator } from '@src/utils/generator';
import { CreateGuestDto } from '@src/domain/dtos/guest';
import { citiesList } from '@src/data/seed';
import { DateValidator } from '../../../domain/type-validators/type-date';

describe('guest.route.ts', () => {
  let token: string;
  const fullName = Generator.randomName();

  const tokenUser = {
    role: UserRolesList.RECEPTION,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'token@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  const rawCountry = {
    name: 'Colombia',
    id: 'CO',
  };

  const rawUser = {
    role: UserRolesList.RECEPTION,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'test@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  const rawRoom: CreateRoomDto = {
    roomType: RoomTypesList.SUIT,
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

  const rawGuest: CreateGuestDto = {
    di: Generator.randomIdentityNumber(),
    city: Generator.randomCity(citiesList),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    phone: Generator.randomPhone(),
    roomNumber: 1,
    countryId: rawCountry.id,
    registerId: '',
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
    await prisma.guest.deleteMany();
    await prisma.register.deleteMany();
    await prisma.room.deleteMany();
    await prisma.country.deleteMany();
    await prisma.user.deleteMany();

    // * create auth token
    const user = await prisma.user.create({ data: tokenUser });
    token = await JwtAdapter.generateToken({ payload: { id: user.id } });
  });

  it('should get all register (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser }),
      await prisma.room.create({ data: rawRoom }),
    ]);
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });
    await prisma.guest.createMany({
      data: [{ ...rawGuest, registerId: register.id, countryId: country.id }],
    });
    const { body } = await request(testServer.app)
      .get('/api/guest')
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe(null);
    expect(body.prev).toBe(null);
    expect(body.guests).toBeInstanceOf(Array);
    expect(body.guests[0]).toEqual({
      id: expect.any(String),
      di: expect.any(String),
      checkIn: expect.any(String),
      checkOut: expect.any(String),
      dateOfBirth: expect.any(String),
      city: expect.any(String),
      name: expect.any(String),
      lastName: expect.any(String),
      phone: expect.any(String),
      roomNumber: expect.any(Number),
      countryId: expect.any(String),
      registerId: expect.any(String),
    });
  });

  test('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;

    const { body } = await request(testServer.app)
      .get(`/api/guest?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  test('should get a guest by id (getById)', async () => {
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser }),
      await prisma.room.create({ data: rawRoom }),
    ]);
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });
    const guestDB = await prisma.guest.create({
      data: { ...rawGuest, registerId: register.id, countryId: country.id },
    });
    const { body } = await request(testServer.app)
      .get(`/api/guest/${guestDB.id}`)
      .expect(200);

    const { ok, guest } = body;

    expect(ok).toBeTruthy();
    expect(guest.id).toBe(guestDB.id);
    expect(guest.di).toBe(guestDB.di);
    expect(DateValidator.isValid(guest.checkIn)).toBeTruthy();
    expect(DateValidator.isValid(guest.checkOut)).toBeTruthy();
    expect(DateValidator.isValid(guest.dateOfBirth)).toBeTruthy();
    expect(guest.city).toBe(guestDB.city);
    expect(guest.name).toBe(guestDB.name);
    expect(guest.lastName).toBe(guestDB.lastName);
    expect(guest.phone).toBe(guestDB.phone);
    expect(guest.roomNumber).toBe(guestDB.roomNumber);
    expect(guest.countryId).toBe(guestDB.countryId);
    expect(guest.registerId).toBe(guestDB.registerId);
  });

  test('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/guest/${id}`)
      .expect(404);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toEqual(`guest with id: ${id} not found`);
  });

  test('should create a user (create)', async () => {
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser }),
      await prisma.room.create({ data: rawRoom }),
    ]);
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });

    const { body } = await request(testServer.app)
      .post('/api/guest')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...rawGuest, registerId: register.id, countryId: country.id })
      .expect(201);

    const { ok, guest } = body;

    expect(ok).toBeTruthy();
    expect(guest.id).toBeDefined();
    expect(guest.di).toBeDefined();
    expect(DateValidator.isValid(guest.checkIn)).toBeTruthy();
    expect(DateValidator.isValid(guest.checkOut)).toBeTruthy();
    expect(DateValidator.isValid(guest.dateOfBirth)).toBeTruthy();
    expect(guest.city).toBeDefined();
    expect(guest.name).toBeDefined();
    expect(guest.lastName).toBeDefined();
    expect(guest.phone).toBeDefined();
    expect(guest.roomNumber).toBeDefined();
    expect(guest.countryId).toBeDefined();
    expect(guest.registerId).toBeDefined();
  });

  test('should get and error if register not found (create)', async () => {
    const registerId = Uuid.v4();

    const { body } = await request(testServer.app)
      .post('/api/guest')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...rawGuest, registerId, countryId: rawCountry.id })
      .expect(404);

    const { ok, errors } = body;

    expect(ok).toBeFalsy();
    expect(errors[0]).toEqual(`register with id ${registerId} not found`);
  });

  test('should get error white create guest (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/guest')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: [
        'di property is required',
        'city property is required',
        'name property is required',
        'lastName property is required',
        'phone property is required',
        'roomNumber property is required',
        'countryId property is required',
        'countryId not valid',
        'dateOfBirth property is required',
        'registerId property is required',
      ],
    });
  });

  test('should update a guest (update)', async () => {
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser }),
      await prisma.room.create({ data: rawRoom }),
    ]);
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });
    const guestDB = await prisma.guest.create({
      data: { ...rawGuest, registerId: register.id, countryId: country.id },
    });

    const name = 'name_update';

    const { body } = await request(testServer.app)
      .put(`/api/guest`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: guestDB.id, name })
      .expect(200);

    const guestUpdate = await prisma.guest.findUnique({
      where: { id: guestDB.id },
    });

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('guest updated successfully');
    expect(guestUpdate?.name).toBe(name);
  });

  test('should get and error while updating a guest (update)', async () => {
    const name = false;

    const { body } = await request(testServer.app)
      .put(`/api/guest`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: Uuid.v4(), name })
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['name property most be a string'],
    });
  });

  test('should delete a guest by id (delete)', async () => {
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser }),
      await prisma.room.create({ data: rawRoom }),
    ]);
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });
    await prisma.guest.createMany({
      data: [
        { ...rawGuest, registerId: register.id, countryId: country.id },
        {
          ...rawGuest,
          registerId: register.id,
          countryId: country.id,
          di: Generator.randomIdentityNumber(),
        },
      ],
    });

    const guestDB = await prisma.guest.findMany();

    const { body } = await request(testServer.app)
      .delete(`/api/guest/${guestDB[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('guest deleted successfully');
  });

  test('should not delete a guest if there is only one (delete)', async () => {
    const [country, user, room] = await Promise.all([
      await prisma.country.create({ data: rawCountry }),
      await prisma.user.create({ data: rawUser }),
      await prisma.room.create({ data: rawRoom }),
    ]);
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: 1,
      },
    });
    const guestDB = await prisma.guest.create({
      data: { ...rawGuest, registerId: register.id, countryId: country.id },
    });

    const { body } = await request(testServer.app)
      .delete(`/api/guest/${guestDB.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(409);

    const { ok, errors } = body;

    expect(ok).toBeFalsy();
    expect(errors[0]).toBe('register most have 1 guest as minimum');
  });
});
