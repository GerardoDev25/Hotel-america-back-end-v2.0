import request from 'supertest';
import { BcryptAdapter, JwtAdapter, Uuid } from '@src/adapters';
import { prisma } from '@src/data/postgres';
import { CreateRegisterDto } from '@domain/dtos/register';
import { CreateRoomDto } from '@domain/dtos/room';
import {
  UserRolesList,
  RoomTypesList,
  ChargeTypeList,
} from '@domain/interfaces';
import { testServer } from '@src/test-server';
import { Generator } from '@src/utils/generator';

describe('charge.route.ts', () => {
  let token: string;

  const tokenUser = {
    role: UserRolesList.RECEPTION,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'token@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  const rawCharge = { amount: 100, type: ChargeTypeList.LODGING };

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

  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.charge.deleteMany();
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
    const [user, room] = await Promise.all([
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
    await prisma.charge.create({
      data: { ...rawCharge, registerId: register.id },
    });
    const { body } = await request(testServer.app)
      .get('/api/charge')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe(null);
    expect(body.prev).toBe(null);
    expect(body.charges).toBeInstanceOf(Array);
    expect(body.charges[0]).toEqual({
      id: expect.any(String),
      amount: rawCharge.amount,
      description: expect.any(String),
      createdAt: expect.any(String),
      type: rawCharge.type,
      registerId: register.id,
    });
  });

  test('should get error message if not have auth token (getAll)', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/charge`)
      .expect(401);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Token not provided');
  });

  test('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;

    const { body } = await request(testServer.app)
      .get(`/api/charge?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  test('should get a charge by id (getById)', async () => {
    const [user, room] = await Promise.all([
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
    const chargeDB = await prisma.charge.create({
      data: { ...rawCharge, registerId: register.id },
    });
    const { body } = await request(testServer.app)
      .get(`/api/charge/${chargeDB.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { ok, charge } = body;
    expect(ok).toBeTruthy();
    expect(charge).toMatchObject({
      ...chargeDB,
      createdAt: expect.any(String),
    });
  });

  test('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/charge/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`charge with id: ${id} not found`],
    });
  });

  test('should create a charge (create)', async () => {
    const [user, room] = await Promise.all([
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
      .post('/api/charge')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...rawCharge, registerId: register.id })
      .expect(201);

    expect(body).toMatchObject({
      ok: true,
      charge: {
        id: expect.any(String),
        amount: rawCharge.amount,
        description: expect.any(String),
        createdAt: expect.any(String),
        type: rawCharge.type,
        registerId: register.id,
      },
    });
  });

  test('should get unauthorize error message (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/charge')
      .send({})
      .expect(401);
    expect(body).toMatchObject({ ok: false, errors: ['Token not provided'] });
  });

  test('should get and error if register not found (create)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .post('/api/charge')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...rawCharge, registerId: id })
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`register with id: ${id} not found`],
    });
  });

  test('should verify if is valid object (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/charge')
      .send({ description: 12 })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(body).toMatchObject({
      ok: false,
      errors: [
        'type property is required',
        'amount property is required',
        'registerId property is required',
        'description property most be a string',
      ],
    });
  });

  test('should update a charge (update)', async () => {
    const [user, room] = await Promise.all([
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
    const chargeDB = await prisma.charge.create({
      data: { ...rawCharge, registerId: register.id },
    });
    const description = 'description updated';

    const { body } = await request(testServer.app)
      .put(`/api/charge`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: chargeDB.id, description })
      .expect(200);

    const chargeUpdate = await prisma.charge.findUnique({
      where: { id: chargeDB.id },
    });

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('charge updated successfully');
    expect(chargeUpdate?.description).toBe(description);
  });

  test('should get unauthorize message (update)', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/charge`)
      .send({})
      .expect(401);

    expect(body).toMatchObject({ ok: false, errors: ['Token not provided'] });
  });

  test('should get 404 code if charge not found (update)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .put(`/api/charge`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id })
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`charge with id: ${id} not found`],
    });
  });

  test('should get and error while updating a charge (update)', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/charge`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: Uuid.v4(),
        amount: 'hello',
        type: 'not',
        description: 12,
      })
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: [
        'type most be: cafeteria, laundry, lodging, other, new_guest',
        'amount property most be a number',
        'description property most be a string',
      ],
    });
  });

  test('should delete a charge by id (delete)', async () => {
    const [user, room] = await Promise.all([
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
    const chargeDB = await prisma.charge.create({
      data: { ...rawCharge, registerId: register.id },
    });

    const { body } = await request(testServer.app)
      .delete(`/api/charge/${chargeDB.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const chargeDeleted = await prisma.charge.findUnique({
      where: { id: chargeDB.id },
    });

    expect(chargeDeleted).toBeNull();
    expect(body).toMatchObject({
      ok: true,
      message: 'charge deleted successfully',
    });
  });

  test('should get unauthorize message (delete)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .delete(`/api/charge/${id}`)
      .expect(401);

    expect(body).toMatchObject({ ok: false, errors: ['Token not provided'] });
  });

  test('should get 404 code if charge not found (delete)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .delete(`/api/charge/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`charge with id: ${id} not found`],
    });
  });
});
