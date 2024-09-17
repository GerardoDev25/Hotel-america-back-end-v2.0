import { JwtAdapter } from './jwt.adapter';

describe('jwt.adapter.ts', () => {
  it('should create a valid JWT when provided with a payload', async () => {
    const payload = { userId: '12345' };
    const expiresIn = '1h';

    const token = await JwtAdapter.generateToken({ payload, expiresIn });

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should handle errors when the payload is invalid', async () => {
    const payload = undefined;

    await expect(JwtAdapter.generateToken({ payload })).rejects.toEqual(
      'error white create token'
    );
  });

  it('should correctly decode a valid JWT', async () => {
    const payload = { userId: '12345' };
    const expiresIn = '1h';
    const verifySpy = jest.spyOn(JwtAdapter, 'verifyToken');

    const token = await JwtAdapter.generateToken({ payload, expiresIn });
    const verifyToken = await JwtAdapter.verifyToken<{ userId: string }>(token);

    expect(verifySpy).toHaveBeenCalled();
    expect(verifyToken?.userId).toBe(payload.userId);
  });

  it('should throw error if no valid jwt', async () => {
    const token = 'invalid token';

    const verifyToken = await JwtAdapter.verifyToken(token);

    expect(verifyToken).toBeNull();
  });
});
