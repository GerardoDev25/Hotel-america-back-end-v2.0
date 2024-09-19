import { JwtAdapter } from '@src/adapters';
import { AuthRefreshTokenDto } from './auth-refresh-token.dto';

describe('auth-refresh-token.dto.ts', () => {
  test('should get and instance', async () => {
    const token = await JwtAdapter.generateToken({ payload: { id: '12' } });

    const data = { token };

    const [errors, instance] = AuthRefreshTokenDto.create(data);

    expect(errors).toBeUndefined();
    expect(instance).toBeInstanceOf(AuthRefreshTokenDto);
    expect(instance?.token).toBe(token);
  });

  test('should get error if token is not valid', async () => {
    const token = 'invalid token';

    const data = { token };

    const [errors, instance] = AuthRefreshTokenDto.create(data);

    expect(errors).toBeDefined();
    expect(errors).toEqual(['token not valid']);
    expect(instance).toBeUndefined();
    expect(errors?.length).toBeGreaterThan(0);
  });
});
