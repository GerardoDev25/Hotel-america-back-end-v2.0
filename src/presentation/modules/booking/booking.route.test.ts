import request from 'supertest';
import { BcryptAdapter, JwtAdapter, Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { prisma } from '@src/data/postgres';
import { seedData } from '@src/data/seed/data';
import { testServer } from '@src/test-server';
import { BookingPagination, FilterBooking, IBooking } from '@domain/interfaces';

describe('booking.route.ts', () => {
  const page = 1;
  const limit = 10;
  let token: string;

  const rawUser = {
    role: 'reception',
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'test@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  beforeAll(async () => {
    await testServer.start();

    await prisma.booking.deleteMany();
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
    const user = await prisma.user.create({ data: rawUser as any });
    token = await JwtAdapter.generateToken({ payload: { id: user.id } });
  });

  it('should get all bookings (getAll)', async () => {
    await prisma.booking.createMany({ data: seedData.bookings });
    const { body }: { body: BookingPagination } = await request(testServer.app)
      .get('/api/booking/')
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(typeof body.next).toBe('string');
    expect(body.prev).toBeNull();

    expect(body.bookings).toBeInstanceOf(Array);
  });

  it('should get error message if pagination is grown (getAll)', async () => {
    const page = 'page';
    const limit = 'limit';
    const { body } = await request(testServer.app)
      .get(`/api/booking?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page and limit must be a number');
  });

  it('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;
    const { body } = await request(testServer.app)
      .get(`/api/booking?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  it('should get bookings (getByParams)', async () => {
    const params: FilterBooking = {
      checkIn: seedData.bookings[0].checkIn.toISOString().split('T')[0],
    };
    await prisma.booking.createMany({ data: seedData.bookings });
    const { body }: { body: BookingPagination } = await request(testServer.app)
      .post('/api/booking/get-by-params')
      .send(params)
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();

    expect(body.bookings).toBeInstanceOf(Array);

    for (const booking of body.bookings) {
      expect(booking.checkIn).toBe(params.checkIn);
    }
  });

  it('should get error message with wrong params (getByParams)', async () => {
    const params = { name: false, guestsNumber: 'help' };

    const { body } = await request(testServer.app)
      .post(`/api/booking/get-by-params`)
      .send(params)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors).toMatchObject([
      'guestsNumber property most be a number',
      'name property most be a string',
    ]);
  });

  it('should get a booking by id (getById)', async () => {
    const bookingTest = await prisma.booking.create({
      data: seedData.bookings[0],
    });
    const { body }: { body: { ok: boolean; booking: IBooking } } =
      await request(testServer.app)
        .get(`/api/booking/${bookingTest.id}`)
        .expect(200);

    const { ok, booking } = body;

    expect(ok).toBeTruthy();
    expect(bookingTest.id).toEqual(booking.id);
  });

  it('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/booking/${id}`)
      .expect(404);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toEqual(`booking with id: ${id} not found`);
  });

  it('should create a booking (create)', async () => {
    const bookingCreated = seedData.bookings[0];
    const { body }: { body: { ok: boolean; booking: IBooking } } =
      await request(testServer.app)
        .post('/api/booking')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingCreated)
        .expect(201);

    const { ok, booking } = body;

    expect(ok).toBeTruthy();
    expect(booking.id).toBeDefined();
  });

  it('should get error white create booking (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/booking')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: [
        'amount property is required',
        'guestsNumber property is required',
        'name property is required',
        'description property is required',
        'checkIn property is required',
      ],
    });
  });

  it('should update a booking (update)', async () => {
    const bookingCreated = await prisma.booking.create({
      data: seedData.bookings[0],
    });
    const name = 'name_update';

    const { body }: { body: { ok: boolean; message: string } } = await request(
      testServer.app
    )
      .put(`/api/booking`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: bookingCreated.id, name })
      .expect(200);
    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('booking updated successfully');
  });

  it('should get and error while updating a booking (update)', async () => {
    const bookingCreated = await prisma.booking.create({
      data: seedData.bookings[0],
    });
    const name = false;

    const { body } = await request(testServer.app)
      .put(`/api/booking`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: bookingCreated.id, name })
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['name property most be a string'],
    });
  });

  it('should delete a booking by id (delete)', async () => {
    const booking = await prisma.booking.create({ data: seedData.bookings[0] });

    const { body } = await request(testServer.app)
      .delete(`/api/booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('booking deleted successfully');
  });
});
