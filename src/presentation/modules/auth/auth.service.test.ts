import { AuthLoginDto } from '@domain/dtos/auth';
import { UserDatasource } from '@domain/datasources';
import { CustomError } from '@domain/error';
import { AuthService } from './auth.service';
import { Generator } from '@src/utils/generator';
import { JwtAdapter, Uuid, BcryptAdapter } from '@src/adapters';
import { StringValidator } from '@domain/type-validators';
import { IUser, UserPagination } from '@domain/interfaces';

describe('auth.service.ts', () => {
  const user: AuthLoginDto = {
    username: Generator.randomUsername().trim().toLowerCase(),
    password: Generator.randomPassword().trim(),
  };
  const passwordCrypt = BcryptAdapter.hash(user.password);
  const userId = Uuid.v4();

  const pagination: UserPagination = {
    users: [
      { ...user, password: passwordCrypt, isActive: true, id: userId } as IUser,
    ],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  it('should to have been called with parameter (login)', async () => {
    const userDatasource = {
      getById: jest.fn(),
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as unknown as UserDatasource;

    const authService = new AuthService(userDatasource);

    const bcryptSpy = jest.spyOn(BcryptAdapter, 'compare');
    const customErrorSpy = jest.spyOn(CustomError, 'badRequest');
    const jwtAdapterSpy = jest.spyOn(JwtAdapter, 'generateToken');

    await authService.login(user);

    expect(bcryptSpy).toHaveBeenCalledWith(user.password, passwordCrypt);
    expect(customErrorSpy).not.toHaveBeenCalled();
    expect(jwtAdapterSpy).toHaveBeenCalledWith({ payload: { id: userId } });
    expect(userDatasource.getByParams).toHaveBeenCalledWith(1, 1, {
      username: user.username,
    });
  });

  it('should to throw error if user is null (login)', async () => {
    const userDatasource = {
      getById: jest.fn(),
      getByParams: jest.fn().mockResolvedValue({ ...pagination, users: [] }),
    } as unknown as UserDatasource;

    const authService = new AuthService(userDatasource);

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

  it('should to throw error if user is not active (login)', async () => {
    const userDatasource = {
      getById: jest.fn(),
      getByParams: jest.fn().mockResolvedValue({
        ...pagination,
        users: [{ ...user, isActive: false, id: userId }] as IUser[],
      }),
    } as unknown as UserDatasource;

    const authService = new AuthService(userDatasource);

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

  it('should to throw error if password not match (login)', async () => {
    const userDatasource = {
      getById: jest.fn(),
      getByParams: jest.fn().mockResolvedValue({
        ...pagination,
        users: [{ ...user, isActive: true }],
      }),
    } as unknown as UserDatasource;

    const authService = new AuthService(userDatasource);

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

  it('should get a new jwt if pass a valid jwt (refreshToken)', async () => {
    const userDatasource = {
      getById: jest.fn().mockResolvedValue({
        ok: true,
        user: { ...user, isActive: true },
      }),
    } as unknown as UserDatasource;

    const userId = Uuid.v4();

    const token = await JwtAdapter.generateToken({
      payload: { id: userId },
    });

    const authService = new AuthService(userDatasource);

    const newToken = await authService.refreshToken({ token });

    expect(StringValidator.isJWT(newToken.token)).toBeTruthy();
  });

  it('should get an error if user is null (refreshToken)', async () => {
    const userDatasource = {
      getById: jest.fn().mockResolvedValue({ ok: false, user: null }),
    } as unknown as UserDatasource;

    const userId = Uuid.v4();

    const token = await JwtAdapter.generateToken({
      payload: { id: userId },
    });

    const authService = new AuthService(userDatasource);
    const customErrorSpy = jest.spyOn(CustomError, 'badRequest');

    try {
      await authService.refreshToken({ token });
    } catch (error: any) {
      expect(error.message).toContain('user not allow');
      expect(customErrorSpy).toHaveBeenCalledWith(error.message);
    }
  });

  it('should get error if is not valid jwt (refreshToken)', async () => {
    const userDatasource = {} as unknown as UserDatasource;
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const authService = new AuthService(userDatasource);

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
