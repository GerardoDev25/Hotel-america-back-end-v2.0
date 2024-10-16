import { AuthLoginDto } from '@domain/dtos/auth';
import { UserRepository } from '@domain/repositories';
import { CustomError } from '@domain/error';
import { AuthService } from './auth.service';
import { Generator } from '@src/utils/generator';
import { JwtAdapter, Uuid, BcryptAdapter } from '@src/adapters';
import { StringValidator } from '../../../domain/type-validators/type-string';

describe('auth.service.ts', () => {
  const user: AuthLoginDto = {
    username: Generator.randomUsername().trim().toLowerCase(),
    password: Generator.randomPassword().trim(),
  };

  test('should to have been called with parameter (login)', async () => {
    const passwordCrypt = BcryptAdapter.hash(user.password);
    const userId = Uuid.v4();

    const userRepository = {
      getById: jest.fn(),
      getByParam: jest.fn().mockResolvedValue({
        ok: true,
        user: { ...user, password: passwordCrypt, isActive: true, id: userId },
      }),
    } as unknown as UserRepository;

    const authService = new AuthService(userRepository);

    const bcryptSpy = jest.spyOn(BcryptAdapter, 'compare');
    const customErrorSpy = jest.spyOn(CustomError, 'badRequest');
    const jwtAdapterSpy = jest.spyOn(JwtAdapter, 'generateToken');

    await authService.login(user);

    expect(bcryptSpy).toHaveBeenCalledWith(user.password, passwordCrypt);
    expect(customErrorSpy).not.toHaveBeenCalled();
    expect(jwtAdapterSpy).toHaveBeenCalledWith({ payload: { id: userId } });
    expect(userRepository.getByParams).toHaveBeenCalledWith(1, 1, {
      username: user.username,
    });
  });

  test('should to throw error if user is null (login)', async () => {
    const userRepository = {
      getById: jest.fn(),
      getByParam: jest.fn().mockResolvedValue({
        ok: false,
        user: null,
      }),
    } as unknown as UserRepository;

    const authService = new AuthService(userRepository);

    const bcryptSpy = jest.spyOn(BcryptAdapter, 'compare');
    const customErrorSpy = jest.spyOn(CustomError, 'badRequest');
    const jwtAdapterSpy = jest.spyOn(JwtAdapter, 'generateToken');

    try {
      await authService.login(user);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe('user or password not allow');
      expect(bcryptSpy).not.toHaveBeenCalled();
      expect(customErrorSpy).toHaveBeenCalledWith(error.message);
      expect(jwtAdapterSpy).not.toHaveBeenCalled();
    }
  });

  test('should to throw error if user is not active (login)', async () => {
    const userRepository = {
      getById: jest.fn(),
      getByParam: jest.fn().mockResolvedValue({
        ok: false,
        user: { ...user, isActive: false },
      }),
    } as unknown as UserRepository;

    const authService = new AuthService(userRepository);

    const bcryptSpy = jest.spyOn(BcryptAdapter, 'compare');
    const customErrorSpy = jest.spyOn(CustomError, 'badRequest');
    const jwtAdapterSpy = jest.spyOn(JwtAdapter, 'generateToken');

    try {
      await authService.login(user);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe('user or password not allow');
      expect(bcryptSpy).not.toHaveBeenCalled();
      expect(customErrorSpy).toHaveBeenCalledWith(error.message);
      expect(jwtAdapterSpy).not.toHaveBeenCalled();
    }
  });

  test('should to throw error if password not match (login)', async () => {
    const userRepository = {
      getById: jest.fn(),
      getByParam: jest.fn().mockResolvedValue({
        ok: false,
        user: { ...user, isActive: true },
      }),
    } as unknown as UserRepository;

    const authService = new AuthService(userRepository);

    const bcryptSpy = jest.spyOn(BcryptAdapter, 'compare');
    const customErrorSpy = jest.spyOn(CustomError, 'badRequest');
    const jwtAdapterSpy = jest.spyOn(JwtAdapter, 'generateToken');

    try {
      await authService.login(user);
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe('user or password not allow');
      expect(bcryptSpy).toHaveBeenCalled();
      expect(bcryptSpy).toHaveBeenCalledWith(user.password, user.password);
      expect(customErrorSpy).toHaveBeenCalledWith(error.message);
      expect(jwtAdapterSpy).not.toHaveBeenCalled();
    }
  });

  test('should get a new jwt if pass a valid jwt (refreshToken)', async () => {
    const userRepository = {
      getById: jest.fn().mockResolvedValue({
        ok: true,
        user: { ...user, isActive: true },
      }),
    } as unknown as UserRepository;

    const userId = Uuid.v4();

    const token = await JwtAdapter.generateToken({
      payload: { id: userId },
    });

    const authService = new AuthService(userRepository);

    const newToken = await authService.refreshToken({ token });

    expect(StringValidator.isJWT(newToken.token)).toBeTruthy();
  });

  test('should get an error if user is null (refreshToken)', async () => {
    const userRepository = {
      getById: jest.fn().mockResolvedValue({ ok: false, user: null }),
    } as unknown as UserRepository;

    const userId = Uuid.v4();

    const token = await JwtAdapter.generateToken({
      payload: { id: userId },
    });

    const authService = new AuthService(userRepository);
    const customErrorSpy = jest.spyOn(CustomError, 'badRequest');

    try {
      await authService.refreshToken({ token });
    } catch (error: any) {
      expect(error.message).toContain('user not allow');
      expect(customErrorSpy).toHaveBeenCalledWith(error.message);
    }
  });

  test('should get error if is not valid jwt (refreshToken)', async () => {
    const userRepository = {} as unknown as UserRepository;
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const authService = new AuthService(userRepository);

    const jwtAdapterSpy = jest.spyOn(JwtAdapter, 'verifyToken');
    const customErrorSpy = jest.spyOn(CustomError, 'unauthorized');

    try {
      await authService.refreshToken({ token });
    } catch (error: any) {
      expect(error.message).toContain('token invalid or expired');
      expect(jwtAdapterSpy).toHaveBeenCalledWith(token);
      expect(customErrorSpy).toHaveBeenCalledWith(error.message);
    }
  });
});
