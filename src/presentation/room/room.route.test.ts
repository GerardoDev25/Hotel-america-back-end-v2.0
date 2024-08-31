import request from 'supertest';

import { prisma } from '../../data/postgres';
import { testServer } from '../../test-server';
import { seedData } from '../../data/seed/data';

describe('room.route.ts', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.room.deleteMany();
  });

  test('should get all room (getAll)', async () => {
    const page = 1;
    const limit = 10;
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app).get('/api/room').expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe('/api/room?page=2&limit=10');
    expect(body.prev).toBe(null);

    expect(body.rooms).toBeInstanceOf(Array);
    expect(body.rooms[0]).toEqual({
      betsNumber: expect.any(Number),
      id: expect.any(String),
      isAvailable: expect.any(Boolean),
      roomNumber: expect.any(Number),
      roomType: expect.any(String),
    });
  });

  test('should get all room with pagination (getAll)', async () => {
    const page = 2;
    const limit = 7;
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}`)
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBe(`/api/room?page=${page + 1}&limit=${limit}`);
    expect(body.prev).toBe(`/api/room?page=${page - 1}&limit=${limit}`);
  });

  test('should get all rooms Available (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const isAvailable = true;
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}&isAvailable=${isAvailable}`)
      .expect(200);

    body.rooms.forEach((room: any) => {
      expect(room.isAvailable).toBe(isAvailable);
    });
  });

  test('should get all rooms not Available (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const isAvailable = false;
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}&isAvailable=${isAvailable}`)
      .expect(200);

    body.rooms.forEach((room: any) => {
      expect(room.isAvailable).toBe(isAvailable);
    });
  });

  test('should get error message if isAvailable is not a boolean (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const isAvailable = 'not-boolean';
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}&isAvailable=${isAvailable}`)
      .expect(400);

    expect(body).toEqual({ error: 'isAvailable most be true or false' });
  });

  test('should get error message if pagination is grown', async () => {
    const page = 'page';
    const limit = 'limit';
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body).toEqual({ error: 'Page and limit must be a number' });
  });

  test('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body).toEqual({ error: 'Page must be greaten than 0' });
  });

  test('should get a room by id', async () => {
    const room = await prisma.room.create({ data: seedData.rooms[0] });
    const { body } = await request(testServer.app)
      .get(`/api/room/${room.id}`)
      .expect(200);

    expect(room.id).toEqual(body.id);
    expect(room.roomType).toEqual(body.roomType);
    expect(room.roomNumber).toBe(body.roomNumber);
    expect(room.betsNumber).toBe(body.betsNumber);
    expect(room.isAvailable).toBe(body.isAvailable);
  });

  test('should get not found message (getById)', async () => {
    const id = 'no-room';
    const { body } = await request(testServer.app)
      .get(`/api/room/${id}`)
      .expect(404);

    expect(body).toEqual({ error: `todo with id: ${id} not found` });
  });

  test('should create a room', async () => {
    const room = seedData.rooms[0];
    const { body } = await request(testServer.app)
      .post('/api/room')
      .send(room)
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.roomType).toEqual(room.roomType);
    expect(body.roomNumber).toBe(room.roomNumber);
    expect(body.betsNumber).toBe(room.betsNumber);
    expect(body.isAvailable).toBe(room.isAvailable);
  });

  test('should get error white create room (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/room')
      .send({})
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: [
        'roomType property is required',
        'roomNumber property is required',
        'betsNumber property is required',
      ],
    });
  });

  test('should update a room (update)', async () => {
    const room = await prisma.room.create({ data: seedData.rooms[0] });
    const betsNumber = 1000;

    const { body } = await request(testServer.app)
      .put(`/api/room/`)
      .send({ id: room.id, betsNumber })
      .expect(200);

    expect(body.id).toBe(room.id);
    expect(body.betsNumber).toBe(betsNumber);
  });

  test('should get and error while updating a room (update)', async () => {
    const room = await prisma.room.create({ data: seedData.rooms[0] });
    const betsNumber = 'not-valid';

    const { body } = await request(testServer.app)
      .put(`/api/room/`)
      .send({ id: room.id, betsNumber })
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['betsNumber property most be a number'],
    });
  });

  test('should delete a room by id', async () => {
    const room = await prisma.room.create({ data: seedData.rooms[0] });

    const { body } = await request(testServer.app)
      .delete(`/api/room/${room.id}`)
      .send()
      .expect(200);

    expect(body).toEqual({
      id: expect.any(String),
      roomType: expect.any(String),
      roomNumber: expect.any(Number),
      betsNumber: expect.any(Number),
      isAvailable: expect.any(Boolean),
    });
  });
});
