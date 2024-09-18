import request from 'supertest';

import { prisma } from '../../../data/postgres';
import { testServer } from '../../../test-server';
import { seedData } from '../../../data/seed/data';
import { Uuid } from '../../../adapters';

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

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('isAvailable most be true or false');
  });

  test('should get error message if pagination is grown (getAll)', async () => {
    const page = 'page';
    const limit = 'limit';
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page and limit must be a number');
  });

  test('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;
    await prisma.room.createMany({ data: seedData.rooms });
    const { body } = await request(testServer.app)
      .get(`/api/room?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  test('should get a room by id (getById)', async () => {
    const roomTest = await prisma.room.create({ data: seedData.rooms[0] });
    const { body } = await request(testServer.app)
      .get(`/api/room/${roomTest.id}`)
      .expect(200);

    const { ok, room } = body;

    expect(ok).toBeTruthy();
    expect(roomTest.id).toEqual(room.id);
    expect(roomTest.roomType).toEqual(room.roomType);
    expect(roomTest.roomNumber).toBe(room.roomNumber);
    expect(roomTest.betsNumber).toBe(room.betsNumber);
    expect(roomTest.isAvailable).toBe(room.isAvailable);
  });

  test('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/room/${id}`)
      .expect(404);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toEqual(`room with id: ${id} not found`);
  });

  test('should create a room (create)', async () => {
    const roomCreated = seedData.rooms[0];
    const { body } = await request(testServer.app)
      .post('/api/room')
      .send(roomCreated)
      .expect(201);

    const { ok, room } = body;

    expect(ok).toBeTruthy();
    expect(room.id).toBeDefined();
    expect(room.roomType).toEqual(roomCreated.roomType);
    expect(room.roomNumber).toBe(roomCreated.roomNumber);
    expect(room.betsNumber).toBe(roomCreated.betsNumber);
    expect(room.isAvailable).toBe(roomCreated.isAvailable);
  });

  test('should get error white create room (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/room')
      .send({})
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: [
        'betsNumber property is required',
        'roomNumber property is required',
        'roomType property is required',
      ],
    });
  });

  test('should update a room (update)', async () => {
    const roomCreated = await prisma.room.create({ data: seedData.rooms[0] });
    const betsNumber = 1000;

    const { body } = await request(testServer.app)
      .put(`/api/room/`)
      .send({ id: roomCreated.id, betsNumber })
      .expect(200);
    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('room updated successfully');
  });

  test('should get and error while updating a room (update)', async () => {
    const roomCreated = await prisma.room.create({ data: seedData.rooms[0] });
    const betsNumber = 'not-valid';

    const { body } = await request(testServer.app)
      .put(`/api/room/`)
      .send({ id: roomCreated.id, betsNumber })
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['betsNumber property most be a number'],
    });
  });

  test('should delete a room by id (delete)', async () => {
    const room = await prisma.room.create({ data: seedData.rooms[0] });

    const { body } = await request(testServer.app)
      .delete(`/api/room/${room.id}`)
      .send()
      .expect(200);

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('room deleted successfully');
  });
});
