import { envs } from './envs';

describe('envs.tets.ts', () => {
  test('should return options', () => {
    expect(envs).toEqual({
      PORT: 3000,
      POSTGRES_USER: process.env.POSTGRES_USER,
      JWT_DURATION: process.env.JWT_DURATION,
      JWT_SEED: process.env.JWT_SEED,
      POSTGRES_DB: process.env.POSTGRES_DB,
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
      DB_PORT: 5430,
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
    });
  });

  test('should return error if not found env', async () => {
    jest.resetModules();
    process.env.PORT = 'ABC';

    try {
      await import('./envs');

      expect(true).toBe(false);
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer');
    }
  });
});
