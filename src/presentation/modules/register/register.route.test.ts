import request from 'supertest';
import {
  ChargeTypeList,
  PaymentTypeList,
  RegisterFilter,
  RoomTypesList,
  UserRolesList,
} from '@domain/interfaces';
import { CreateRoomDto } from '@domain/dtos/room';
import { CreateRegisterDto } from '@domain/dtos/register';
import { variables } from '@domain/variables';
import { DateValidator } from '@domain/type-validators';
import { CreateUserDto } from '@domain/dtos/user';
import { prisma } from '@src/data/postgres';
import { testServer } from '@src/test-server';
import { BcryptAdapter, JwtAdapter, Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';

describe('register.route.ts', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeAll(async () => {
    await prisma.charge.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.register.deleteMany();
    await prisma.room.deleteMany();
    await prisma.country.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.charge.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.register.deleteMany();
    await prisma.room.deleteMany();
    await prisma.country.deleteMany();
    await prisma.user.deleteMany();
  });

  const rawUser: CreateUserDto = {
    role: UserRolesList.RECEPTION,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'Alice Johnson'.trim(),
    phone: '+1122334455'.trim(),
    username: 'Alice_Johnson@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  const rawRoom: CreateRoomDto = {
    roomType: RoomTypesList.SUIT,
    roomNumber: 100,
    state: 'free',
    betsNumber: 2,
    isAvailable: true,
  };

  const rawRegister: CreateRegisterDto = {
    guestsNumber: 1,
    price: 0,
    checkOut: new Date(),
    discount: 0,
    userId: '',
    roomId: '',
  };

  const fullName = Generator.randomName();

  const rawGuest = {
    di: Generator.randomIdentityNumber(),
    city: Generator.randomCity(citiesList).toLowerCase(),
    name: fullName.split(' ').at(0)!.toLowerCase(),
    lastName: fullName.split(' ').at(1)!.toLowerCase(),
    phone: Generator.randomPhone(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    countryId: 'AR',
    dateOfBirth: new Date().toISOString().split('T')[0],
  };

  const rawCharge = { amount: 100, type: ChargeTypeList.LODGING };
  const rawPayment = { amount: 100, type: PaymentTypeList.QR };

  it('should get all register (getAll)', async () => {
    const page = 1;
    const limit = 10;

    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });

    await prisma.register.createMany({
      data: [
        {
          ...rawRegister,
          userId: user.id,
          roomId: room.id,
          guestsNumber: rawRegister.guestsNumber ?? 1,
        },
      ],
    });
    const { body } = await request(testServer.app)
      .get('/api/register')
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe(null);
    expect(body.prev).toBe(null);
    expect(body.registers).toBeInstanceOf(Array);

    expect(body.registers[0]).toEqual({
      id: expect.any(String),
      checkIn: expect.any(String),
      checkOut: expect.any(String),
      guestsNumber: expect.any(Number),
      discount: expect.any(Number),
      price: expect.any(Number),
      userId: expect.any(String),
      roomId: expect.any(String),
    });
  });

  it('should get error if is not well paginated (getAll)', async () => {
    const page = false;
    const limit = false;

    const { body } = await request(testServer.app)
      .get(`/api/register?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page and limit must be a number');
  });

  it('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;
    const { body } = await request(testServer.app)
      .get(`/api/register?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  it('should get registers by params (getByParams)', async () => {
    const page = 1;
    const limit = 10;

    const [user, room] = await Promise.all([
      prisma.user.create({ data: rawUser }),
      prisma.room.create({ data: rawRoom }),
    ]);

    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });

    const params: RegisterFilter = {
      checkIn: register.checkIn.toISOString().split('T').at(0),
      checkOut: register.checkOut?.toISOString().split('T').at(0),
      discount: register.discount,
      price: register.price,
      guestsNumber: register.guestsNumber,
      roomId: register.roomId,
      userId: register.userId,
    };

    const { body } = await request(testServer.app)
      .post('/api/register/get-by-params')
      .send(params)
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe(null);
    expect(body.prev).toBe(null);
    expect(body.registers).toBeInstanceOf(Array);

    for (const register of body.registers) {
      expect(register).toEqual({
        id: expect.any(String),
        checkIn: expect.any(String),
        checkOut: expect.any(String),
        guestsNumber: expect.any(Number),
        discount: expect.any(Number),
        price: expect.any(Number),
        userId: expect.any(String),
        roomId: expect.any(String),
      });
    }
  });

  it('should get error if is not well paginated (getByParams)', async () => {
    const page = false;
    const limit = false;

    const { body } = await request(testServer.app)
      .post(`/api/register/get-by-params?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page and limit must be a number');
  });

  it('should get error if params are wrong (getByParams)', async () => {
    const params: RegisterFilter = {
      checkIn: 'not valid',
      checkOut: 'not valid',
      discount: -12,
      guestsNumber: -45,
      price: -12,
      roomId: '',
      userId: '',
    };

    const { body } = await request(testServer.app)
      .post(`/api/register/get-by-params`)
      .send(params)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors).toMatchObject([
      'guestsNumber property most be greater than or equal to 1',
      'discount property most be a positive',
      'price property most be a positive',
      'userId property is empty',
      'roomId property is empty',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });

  it('should get a register by id (getById)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });

    const registerTest = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });

    const { body } = await request(testServer.app)
      .get(`/api/register/${registerTest.id}`)
      .expect(200);

    const { ok, register } = body;

    expect(ok).toBeTruthy();
    expect(register.id).toBe(registerTest.id);

    expect(register.guestsNumber).toBe(registerTest.guestsNumber);
    expect(register.discount).toBe(registerTest.discount);
    expect(register.price).toBe(registerTest.price);
    expect(register.userId).toBe(registerTest.userId);
    expect(register.roomId).toBe(registerTest.roomId);
    expect(register.checkOut).toEqual(
      new Date(registerTest.checkOut!).toISOString().split('T').at(0)
    );
  });

  it('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/register/${id}`)
      .expect(404);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toEqual(`register with id ${id} not found`);
  });

  it('should create a register (create)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });

    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });

    return request(testServer.app)
      .post('/api/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.ok).toBeTruthy();
        expect(body.register.id).toBeDefined();
        expect(body.register.guestsNumber).toBe(rawRegister.guestsNumber);
        expect(body.register.discount).toBe(rawRegister.discount);
        expect(body.register.price).toBe(rawRegister.price);
        expect(body.register.userId).toBe(user.id);
        expect(body.register.roomId).toBe(room.id);
      });
  });

  it('should get error white create a register (create)', async () => {
    const user = await prisma.user.create({ data: rawUser });

    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });

    return request(testServer.app)
      .post('/api/register')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400)
      .expect(({ body }) => {
        expect(body.ok).toBeFalsy();
        expect(body.errors).toBeInstanceOf(Array);

        expect(body.errors.length).toBe(3);
        expect(body.errors).toContain('discount property is required');
        expect(body.errors).toContain('price property is required');
        expect(body.errors).toContain('roomId property is required');
      });
  });

  it('should make a checkIn (CheckIn)', async () => {
    const country = await prisma.country.create({
      data: { id: 'AR', name: 'Argentina' },
    });
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { guestsNumber, ...restRegister } = rawRegister;

    const data = {
      register: { ...restRegister, roomId: room.id },
      guests: [{ ...rawGuest, countryId: country.id }],
    };
    return request(testServer.app)
      .post('/api/register/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(201)
      .expect(({ body }) => {
        const { register, guests, ok } = body;

        expect(ok).toBeTruthy();
        expect(register.id).toBeDefined();
        expect(register.guestsNumber).toBe(rawRegister.guestsNumber);
        expect(register.discount).toBe(rawRegister.discount);
        expect(register.price).toBe(rawRegister.price);
        expect(register.userId).toBe(user.id);
        expect(register.roomId).toBe(room.id);

        expect(guests[0].id).toBeDefined();
        expect(guests[0].di).toBe(rawGuest.di);
        expect(DateValidator.isValid(guests[0].checkIn)).toBeTruthy();
        expect(DateValidator.isValid(guests[0].dateOfBirth)).toBeTruthy();
        expect(guests[0].city).toBe(rawGuest.city);
        expect(guests[0].name).toBe(rawGuest.name);
        expect(guests[0].lastName).toBe(rawGuest.lastName);
        expect(guests[0].phone).toBe(rawGuest.phone);
        expect(guests[0].registerId).toBe(register.id);
      });
  });

  it('should get error if pass invalid data (CheckIn)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });

    return request(testServer.app)
      .post('/api/register/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400)
      .expect(({ body }) => {
        const { ok, errors } = body;
        expect(ok).toBeFalsy();
        expect(errors).toBeInstanceOf(Array);
        expect(errors).toContain('register object required');
        expect(errors).toContain('guests array required or not valid');
      });
  });

  it('should get error if guests array is invalid (CheckIn)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { guestsNumber, ...restRegister } = rawRegister;

    const data = {
      register: { ...restRegister, roomId: Uuid.v4() },
      guests: [{}],
    };

    return request(testServer.app)
      .post('/api/register/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(400)
      .expect(({ body }) => {
        const { ok, errors } = body;
        expect(ok).toBeFalsy();
        expect(errors).toEqual([
          'di property is required',
          'city property is required',
          'name property is required',
          'lastName property is required',
          'phone property is required',
          'roomNumber property is required',
          'countryId property is required',
          'countryId not valid',
          'dateOfBirth property is required',
        ]);
      });
  });

  it('should get error if register is invalid (CheckIn)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });
    const data = { register: {}, guests: [{ ...rawGuest, countryId: 'AR' }] };

    return request(testServer.app)
      .post('/api/register/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect(400)
      .expect(({ body }) => {
        const { ok, errors } = body;
        expect(ok).toBeFalsy();
        expect(errors).toEqual([
          'discount property is required',
          'price property is required',
          'roomId property is required',
        ]);
      });
  });

  it('should make a checkOut (CheckOut)', async () => {
    const country = await prisma.country.create({
      data: { id: 'AR', name: 'Argentina' },
    });
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
        Charge: { create: { ...rawCharge } },
        Payment: { create: { ...rawPayment } },
        Guest: {
          create: {
            ...rawGuest,
            countryId: country.id,
            dateOfBirth: new Date(rawGuest.dateOfBirth),
          },
        },
      },
    });

    const { body } = await request(testServer.app)
      .delete(`/api/register/check-out/${register.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { ok, registerCheckOutDetail } = body;
    const { guests, charges, payments, ...rest } = registerCheckOutDetail;

    expect(ok).toBeTruthy();
    expect(rest).toMatchObject({
      id: expect.any(String),
      checkIn: expect.any(String),
      checkOut: expect.any(String),
      discount: expect.any(Number),
      price: expect.any(Number),
      roomNumber: expect.any(Number),
      totalCharges: expect.any(Number),
      totalPayments: expect.any(Number),
    });

    expect(guests).toBeInstanceOf(Array);
    expect(guests[0]).toEqual({
      di: expect.any(String),
      dateOfBirth: expect.any(String),
      city: expect.any(String),
      name: expect.any(String),
      lastName: expect.any(String),
      phone: expect.any(String),
      country: expect.any(String),
    });

    expect(charges).toBeInstanceOf(Array);
    expect(charges[0]).toEqual({
      amount: expect.any(Number),
      description: expect.any(String),
      createdAt: expect.any(String),
    });

    expect(payments).toBeInstanceOf(Array);
    expect(payments[0]).toEqual({
      amount: expect.any(Number),
      description: expect.any(String),
      paidAt: expect.any(String),
    });
  });

  it('should get 409 code conflict if amounts not match (CheckOut)', async () => {
    const country = await prisma.country.create({
      data: { id: 'AR', name: 'Argentina' },
    });
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });

    const amount = 20;

    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        discount: 10,
        guestsNumber: rawRegister.guestsNumber ?? 1,
        Charge: { create: { ...rawCharge, amount } },
        Payment: { create: { ...rawPayment, amount } },
        Guest: {
          create: {
            ...rawGuest,
            countryId: country.id,
            dateOfBirth: new Date(rawGuest.dateOfBirth),
          },
        },
      },
    });

    const { body } = await request(testServer.app)
      .delete(`/api/register/check-out/${register.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(409);

    expect(body).toMatchObject({
      ok: false,
      errors: [
        `The total charges: (${amount}) must be equal to the total payments plus discount: (${amount + register.discount})`,
      ],
    });
  });

  it('should get 401 unauthorize if no pass token (CheckOut)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .delete(`/api/register/check-out/${id}`)
      .expect(401);

    expect(body).toMatchObject({ ok: false, errors: ['Token not provided'] });
  });

  it('should update a register (update)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });
    const guestsNumber = 1000;

    return request(testServer.app)
      .put(`/api/register/`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: register.id, guestsNumber })
      .expect(200)
      .expect(async ({ body }) => {
        const { ok, message } = body;
        expect(ok).toBeTruthy();
        expect(message).toBe('register updated successfully');
      });
  });

  it('should get error white update a register (update)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });
    const guestsNumber = 'not';

    return request(testServer.app)
      .put(`/api/register/`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: register.id, guestsNumber })
      .expect(400)
      .expect(({ body }) => {
        const { ok, errors } = body;
        expect(ok).toBeFalsy();
        expect(errors[0]).toBe('guestsNumber property most be a number');
      });
  });

  it('should delete a room by id (delete)', async () => {
    const user = await prisma.user.create({ data: rawUser });
    const room = await prisma.room.create({ data: rawRoom });
    const token = await JwtAdapter.generateToken({ payload: { id: user.id } });
    const register = await prisma.register.create({
      data: {
        ...rawRegister,
        userId: user.id,
        roomId: room.id,
        guestsNumber: rawRegister.guestsNumber ?? 1,
      },
    });

    return request(testServer.app)
      .delete(`/api/register/${register.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200)
      .expect(async ({ body }) => {
        const { ok, message } = body;

        expect(ok).toBeTruthy();
        expect(message).toBe('register deleted successfully');
      });
  });
});
