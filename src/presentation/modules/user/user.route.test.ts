import request from 'supertest';

import { UserFilter, UserRolesList } from '@domain/interfaces';
import { BcryptAdapter, JwtAdapter, Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { prisma } from '@src/data/postgres';
import { seedData } from '@src/data/seed/data';
import { testServer } from '@src/test-server';

describe('user.route.ts', () => {
  const rawUser = {
    role: UserRolesList.ADMIN,
    birdDate: new Date(Generator.randomDateBetween('1970-01-01', '2000-01-01')),
    name: 'John Doe'.trim(),
    phone: '+1234567890'.trim(),
    username: 'test@username'.trim().toLowerCase(),
    password: BcryptAdapter.hash('123456'),
    isActive: true,
  };

  let token: string;

  beforeAll(async () => {
    await testServer.start();

    await prisma.guest.deleteMany();
    await prisma.register.deleteMany();
    await prisma.room.deleteMany();
    await prisma.country.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();

    // * create auth token
    const user = await prisma.user.create({ data: rawUser });
    token = await JwtAdapter.generateToken({ payload: { id: user.id } });
  });

  it('should get all users (getAll)', async () => {
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

  it('should get all users Active (getAll)', async () => {
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

  it('should get all users not Active (getAll)', async () => {
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

  it('should get error message if isActive is not a boolean (getAll)', async () => {
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

  it('should get error message if pagination is grown (getAll)', async () => {
    const page = 'page';
    const limit = 'limit';
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get(`/api/user?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page and limit must be a number');
  });

  it('should get error message if pagination contain negative numbers (getAll)', async () => {
    const page = -1;
    const limit = -3;
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .get(`/api/user?page=${page}&limit=${limit}`)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toBe('Page must be greaten than 0');
  });

  it('should get users (getByParams)', async () => {
    const page = 1;
    const limit = 10;
    const params: UserFilter = {
      birdDate: seedData.users[0].birdDate.toISOString().split('T')[0],
    };
    await prisma.user.createMany({ data: seedData.users });
    const { body } = await request(testServer.app)
      .post('/api/user/get-by-params')
      .send(params)
      .expect(200);

    expect(body.page).toBe(page);
    expect(body.limit).toBe(limit);
    expect(body.total).toBeDefined();
    expect(body.next).toBeNull();
    expect(body.prev).toBeNull();

    expect(body.users).toBeInstanceOf(Array);

    for (const user of body.users) {
      expect(user.birdDate).toBe(params.birdDate);
    }
  });

  it('should get error message with wrong params (getByParams)', async () => {
    const params = { name: false, phone: 12 };

    const { body } = await request(testServer.app)
      .post(`/api/user/get-by-params`)
      .send(params)
      .expect(400);

    expect(body.ok).toBeFalsy();
    expect(body.errors).toMatchObject([
      'name property most be a string',
      'phone property most be a string',
    ]);
  });

  it('should get a user by id (getById)', async () => {
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

  it('should get not found message (getById)', async () => {
    const id = Uuid.v4();
    const { body } = await request(testServer.app)
      .get(`/api/user/${id}`)
      .expect(404);

    expect(body.ok).toBeFalsy();
    expect(body.errors[0]).toEqual(`user with id: ${id} not found`);
  });

  it('should create a user (create)', async () => {
    const userCreated = seedData.users[0];
    const { body } = await request(testServer.app)
      .post('/api/user')
      .set('Authorization', `Bearer ${token}`)
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

  it('should get and error if username is duplicated (create)', async () => {
    const userCreated = seedData.users[0];
    await prisma.user.create({ data: userCreated });

    const { body } = await request(testServer.app)
      .post('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .send(userCreated)
      .expect(409);

    const { ok, errors } = body;

    expect(ok).toBeFalsy();
    expect(errors[0]).toEqual(`username ${userCreated.username} duplicated`);
  });

  it('should get error white create user (create)', async () => {
    const { body } = await request(testServer.app)
      .post('/api/user')
      .set('Authorization', `Bearer ${token}`)
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

  it('should update a user (update)', async () => {
    const userCreated = await prisma.user.create({ data: seedData.users[0] });
    const name = 'name_update';

    const { body } = await request(testServer.app)
      .put(`/api/user/`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: userCreated.id, name })
      .expect(200);
    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('user updated successfully');
  });

  it('should get and error while updating a user (update)', async () => {
    const userCreated = await prisma.user.create({ data: seedData.users[0] });
    const name = false;

    const { body } = await request(testServer.app)
      .put(`/api/user/`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: userCreated.id, name })
      .expect(400);

    expect(body).toEqual({
      ok: false,
      errors: ['name property most be a string'],
    });
  });

  it('should delete a user by id (delete)', async () => {
    const user = await prisma.user.create({ data: seedData.users[0] });

    const { body } = await request(testServer.app)
      .delete(`/api/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    const { ok, message } = body;

    expect(ok).toBeTruthy();
    expect(message).toBe('user deleted successfully');
  });
});
