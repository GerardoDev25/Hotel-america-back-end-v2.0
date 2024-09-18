import { Generator } from '../../../utils/generator';
import { AuthLoginDto } from './auth-login.dto';

describe('auth-login.dto.ts', () => {
  // todo test this later
  test('should create and instance', () => {
    const data = {
      username: Generator.randomUsername(),
      password: Generator.randomPassword(),
    };

    const [errors, instance] = AuthLoginDto.create(data);

    expect(errors).toBeUndefined();
    expect(instance).toBeInstanceOf(AuthLoginDto);
    expect(instance?.password).toBe(data.password.trim());
    expect(instance?.username).toBe(data.username.trim().toLocaleLowerCase());
  });

  it('should get error if properties are wrong', () => {
    const data = {
      username: 12 as unknown as string,
      password: true as unknown as string,
    };

    const [errors, instance] = AuthLoginDto.create(data);


    expect(instance).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'username property most be a string',
      'password property most be a string'
    ]);
  });
});
