import request from 'supertest';
import { prisma } from '@src/data/postgres';
import { testServer } from '@src/test-server';
import { countries } from '@src/data/seed';
import { CountryList } from '@domain/interfaces';

describe('country.route.ts', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.country.deleteMany();
  });

  it('should get all countries (getAll)', async () => {
    await prisma.country.createMany({ data: countries });

    const { body }: { body: CountryList } = await request(testServer.app)
      .get('/api/country')
      .expect(200);

    expect(body.ok).toBeTruthy();
    expect(body.items.length).toBe(countries.length);
  });
});
