import request from 'supertest';

import { prisma } from '@src/data/postgres';
import { seedData } from '@src/data/seed/data';
import { testServer } from '@src/test-server';
import { JwtAdapter } from '@src/adapters';
// import { Uuid } from '@src/adapters';

describe('auth.route.ts', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should login (login)', async () => {
    await prisma.user.create({ data: seedData.users[0] });
    const userToLogin = {
      username: seedData.users[0].username,
      password: '123456',
    };

    const { body } = await request(testServer.app)
      .post('/api/auth/login')
      .send(userToLogin)
      .expect(200);

    const { ok, user, token } = body;

    expect(ok).toBeTruthy();
    expect(user).toBeDefined();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should got login error (login)', async () => {
    await prisma.user.create({ data: seedData.users[0] });
    const userToLogin = {
      username: seedData.users[0].username,
      password: '12345',
    };

    const { body } = await request(testServer.app)
      .post('/api/auth/login')
      .send(userToLogin)
      .expect(400);

    const { ok, errors } = body;

    expect(ok).toBeFalsy();
    expect(errors).toBeDefined();
    expect(errors).toEqual(['user or password not allow']);
  });

  it('should refresh token (refreshToken)', async () => {
    const userDB = await prisma.user.create({ data: seedData.users[0] });
    const tokenToRefresh = await JwtAdapter.generateToken({
      payload: { id: userDB.id },
    });

    const { body } = await request(testServer.app)
      .post('/api/auth/refresh-token')
      .send({ token: tokenToRefresh })
      .expect(200);

    const { ok, user, token } = body;

    expect(ok).toBeTruthy();
    expect(user).toBeDefined();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should got bad request white refresh token (refreshToken)', async () => {
    // const userDB = await prisma.user.create({ data: seedData.users[0] });
    const tokenToRefresh =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0MDI1NzY0LTU4YzEtNDE4ZC1hZTYxLTIzYzEyMmQ3NGRkNyIsImlhdCI6MTcyNjUzNDYyOCwiZXhwIjoxNzI2NTcwNjI4fQ.3n9wejssiqPakLy8e486t64Z4MwcsqncOkaA10EdLhc';

    const { body } = await request(testServer.app)
      .post('/api/auth/refresh-token')
      .send({ token: tokenToRefresh })
      .expect(401);

    const { ok, errors } = body;

    expect(ok).toBeFalsy();
    expect(errors).toBeDefined();
    expect(errors).toEqual(['token invalid or expired']);
  });
});
