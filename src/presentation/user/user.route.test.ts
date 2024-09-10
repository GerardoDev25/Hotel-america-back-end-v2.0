import request from 'supertest';

import { prisma } from '../../data/postgres';
import { testServer } from '../../test-server';
import { seedData } from '../../data/seed/data';
import { Uuid } from '../../adapters';

describe('user.route.ts', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  test('should get all users (getAll)', async () => {
    const page = 1;
    const limit = 10;
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get('/api/user/')
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBeNull();
    expect(body.prev).toBeNull();

    expect(body.users).toBeInstanceOf(Array);
    expect(body.users[0]).toEqual({
      id: expect.any(String),
      birdDate: expect.any(String),
      isActive: expect.any(Boolean),
      name: expect.any(String),
      phone: expect.any(String),
      role: expect.any(String),
      username: expect.any(String),
    });
  });

  test('should get all users Active (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const isActive = true;
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get(`/api/user?page=${page}&limit=${limit}&isActive=${isActive}`)
      .expect(200);

    body.users.forEach((user: any) => {
      expect(user.isActive).toBe(isActive);
    });
  });

  test('should get all users not Active (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const isActive = false;
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get(`/api/user?page=${page}&limit=${limit}&isActive=${isActive}`)
      .expect(200);

    body.users.forEach((user: any) => {
      expect(user.isActive).toBe(isActive);
    });
  });

  test('should get error message if isActive is not a boolean (getAll)', async () => {
    const page = 1;
    const limit = 10;
    const isActive = 'not-boolean';
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get(`/api/user?page=${page}&limit=${limit}&isActive=${isActive}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('isActive most be true or false');
  });

  test('should get error message if pagination is grown (getAll)', async () => {
    const page = 'page';
    const limit = 'limit';
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get(`/api/user?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page and limit must be a number');
  });

  test('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get(`/api/user?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  test('should get a user by id (getById)', async () => {
    const userTest = await prisma.user.create({ data: seedData.users[0] });
    const { body } = await request(testServer.app)
      .get(`/api/user/${userTest.id}`)
      .expect(200);

    const { ok, user } = body;

    expect(ok).toBeTruthy();
    expect(userTest.id).toEqual(user.id);
    expect(userTest.role).toBe(user.role);
    expect(userTest.birdDate).toEqual(new Date(user.birdDate));
    expect(userTest.name).toBe(user.name);
    expect(userTest.phone).toBe(user.phone);
    expect(userTest.username).toBe(user.username);
    expect(user.password).toBeUndefined();
    expect(userTest.isActive).toBe(user.isActive);
  });

  test('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/user/${id}`)
      .expect(404);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toEqual(`user with id: ${id} not found`);
  });

  test('should create a user (create)', async () => {
    const userCreated = seedData.users[0];
    const { body } = await request(testServer.app)
      .post('/api/user')
      .send(userCreated)
      .expect(201);

    const { ok, user } = body;

    expect(ok).toBeTruthy();
    expect(user.id).toBeDefined();
    expect(userCreated.role).toBe(user.role);
    expect(userCreated.birdDate).toEqual(new Date(user.birdDate));
    expect(userCreated.name).toBe(user.name);
    expect(userCreated.phone).toBe(user.phone);
    expect(userCreated.username).toBe(user.username);
    expect(user.password).toBeUndefined();
    expect(userCreated.isActive).toBe(user.isActive);
  });

  test('should get error white create user (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/user')
      .send({})
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: [
        'role property is required',
        'birdDate property is required',
        'name property is required',
        'phone property is required',
        'username property is required',
        'password property is required',
      ],
    });
  });

  test('should update a user (update)', async () => {
    const userCreated = await prisma.user.create({ data: seedData.users[0] });
    const name = 'name_update';

    const { body } = await request(testServer.app)
      .put(`/api/user/`)
      .send({ id: userCreated.id, name })
      .expect(200);
    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('user updated successfully');
  });

  test('should get and error while updating a (update)', async () => {
    const userCreated = await prisma.user.create({ data: seedData.users[0] });
    const name = false;

    const { body } = await request(testServer.app)
      .put(`/api/user/`)
      .send({ id: userCreated.id, name })
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['name property most be a string'],
    });
  });

  test('should delete a user by id (delete)', async () => {
    const user = await prisma.user.create({ data: seedData.users[0] });

    const { body } = await request(testServer.app)
      .delete(`/api/user/${user.id}`)
      .send()
      .expect(200);

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('user deleted successfully');
  });
});
