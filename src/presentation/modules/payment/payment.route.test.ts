import request from 'supertest';
import { BcryptAdapter, JwtAdapter, Uuid } from '@src/adapters';
import { prisma } from '@src/data/postgres';
import { CreateRegisterDto, CreateRoomDto } from '@domain/dtos';
import { testServer } from '@src/test-server';
import { Generator } from '@src/utils/generator';
import { PaymentFilter, CreatePayment } from '@domain/interfaces';

describe('payment.route.ts', () => {
  let token: string;

  const tokenUser = {
    role: 'laundry',
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'token@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  const rawPayment: Omit<CreatePayment, 'registerId'> = {
    amount: 100,
    type: 'qr',
  };

  const rawUser = {
    role: 'reception',
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'test@username'.trim().toLowerCase(),
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

  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.register.deleteMany();
    await prisma.room.deleteMany();
    await prisma.country.deleteMany();
    await prisma.user.deleteMany();

    // * create auth token
    const user = await prisma.user.create({ data: tokenUser as any });
    token = await JwtAdapter.generateToken({ payload: { id: user.id } });
  });

  it('should get all register (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const [user, room] = await Promise.all([
      await prisma.user.create({ data: rawUser as any }),
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
    await prisma.payment.create({
      data: { ...rawPayment, registerId: register.id },
    });
    const { body } = await request(testServer.app)
      .get('/api/payment')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe(null);
    expect(body.prev).toBe(null);
    expect(body.payments).toBeInstanceOf(Array);
    expect(body.payments[0]).toEqual({
      id: expect.any(String),
      amount: rawPayment.amount,
      description: expect.any(String),
      paidAt: expect.any(String),
      type: rawPayment.type,
      registerId: register.id,
    });
  });

  test('should get error message if not have auth token (getAll)', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/payment`)
      .expect(401);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Token not provided');
  });

  test('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;

    const { body } = await request(testServer.app)
      .get(`/api/payment?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  it('should get payment by params (getByParams)', async () => {
    const page = 1;
    const limit = 10;
    const [user, room] = await Promise.all([
      await prisma.user.create({ data: rawUser as any }),
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
    const paymentDB = await prisma.payment.create({
      data: { ...rawPayment, registerId: register.id },
    });

    const params: PaymentFilter = {
      amount: paymentDB.amount,
      type: paymentDB.type,
      paidAt: paymentDB.paidAt.toISOString().split('T')[0],
    };

    const { body } = await request(testServer.app)
      .post('/api/payment/get-by-params')
      .send(params)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe(null);
    expect(body.prev).toBe(null);
    expect(body.payments).toBeInstanceOf(Array);

    for (const payment of body.payments) {
      expect(payment).toMatchObject({
        id: expect.any(String),
        amount: params.amount,
        description: expect.any(String),
        paidAt: params.paidAt,
        type: params.type,
        registerId: register.id,
      });
    }
  });

  it('should get error message if pagination contain negative numbers (getByParams)', async () => {
    const page = -1;
    const limit = -3;

    const { body } = await request(testServer.app)
      .post(`/api/payment/get-by-params?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  it('should get error message with wrong params (getByParams)', async () => {
    const params = { amount: false, type: 'test' };

    const { body } = await request(testServer.app)
      .post(`/api/payment/get-by-params`)
      .set('Authorization', `Bearer ${token}`)
      .send(params)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors).toMatchObject([
      'type most be: bank, cash, credit_cart, qr',
      'amount property most be a number',
    ]);
  });

  test('should get a payment by id (getById)', async () => {
    const [user, room] = await Promise.all([
      await prisma.user.create({ data: rawUser as any }),
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
    const paymentDB = await prisma.payment.create({
      data: { ...rawPayment, registerId: register.id },
    });
    const { body } = await request(testServer.app)
      .get(`/api/payment/${paymentDB.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { ok, payment } = body;
    expect(ok).toBeTruthy();
    expect(payment).toMatchObject({
      ...paymentDB,
      paidAt: expect.any(String),
    });
  });

  test('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/payment/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`payment with id: ${id} not found`],
    });
  });

  test('should create a payment (create)', async () => {
    const [user, room] = await Promise.all([
      await prisma.user.create({ data: rawUser as any }),
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
      .post('/api/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...rawPayment, registerId: register.id })
      .expect(201);

    expect(body).toMatchObject({
      ok: true,
      payment: {
        id: expect.any(String),
        amount: rawPayment.amount,
        description: expect.any(String),
        paidAt: expect.any(String),
        type: rawPayment.type,
        registerId: register.id,
      },
    });
  });

  test('should get unauthorize error message (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/payment')
      .send({})
      .expect(401);
    expect(body).toMatchObject({ ok: false, errors: ['Token not provided'] });
  });

  test('should get and error if register not found (create)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .post('/api/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...rawPayment, registerId: id })
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`register with id: ${id} not found`],
    });
  });

  test('should verify if is valid object (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/payment')
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

  test('should update a payment (update)', async () => {
    const [user, room] = await Promise.all([
      await prisma.user.create({ data: rawUser as any }),
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
    const paymentDB = await prisma.payment.create({
      data: { ...rawPayment, registerId: register.id },
    });
    const description = 'description updated';

    const { body } = await request(testServer.app)
      .put(`/api/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: paymentDB.id, description })
      .expect(200);

    const paymentUpdate = await prisma.payment.findUnique({
      where: { id: paymentDB.id },
    });

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('payment updated successfully');
    expect(paymentUpdate?.description).toBe(description);
  });

  test('should get unauthorize message (update)', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/payment`)
      .send({})
      .expect(401);

    expect(body).toMatchObject({ ok: false, errors: ['Token not provided'] });
  });

  test('should get 404 code if payment not found (update)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .put(`/api/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id })
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`payment with id: ${id} not found`],
    });
  });

  test('should get and error while updating a payment (update)', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/payment`)
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
        'type most be: bank, cash, credit_cart, qr',
        'amount property most be a number',
        'description property most be a string',
      ],
    });
  });

  test('should delete a payment by id (delete)', async () => {
    const [user, room] = await Promise.all([
      await prisma.user.create({ data: rawUser as any }),
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
    const paymentDB = await prisma.payment.create({
      data: { ...rawPayment, registerId: register.id },
    });

    const { body } = await request(testServer.app)
      .delete(`/api/payment/${paymentDB.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const paymentDeleted = await prisma.payment.findUnique({
      where: { id: paymentDB.id },
    });

    expect(paymentDeleted).toBeNull();
    expect(body).toMatchObject({
      ok: true,
      message: 'payment deleted successfully',
    });
  });

  test('should get unauthorize message (delete)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .delete(`/api/payment/${id}`)
      .expect(401);

    expect(body).toMatchObject({ ok: false, errors: ['Token not provided'] });
  });

  test('should get 404 code if payment not found (delete)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .delete(`/api/payment/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(body).toMatchObject({
      ok: false,
      errors: [`payment with id: ${id} not found`],
    });
  });
});
