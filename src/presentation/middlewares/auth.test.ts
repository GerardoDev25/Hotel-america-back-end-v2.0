import { UserDatasource } from '@domain/datasources';
import { JwtAdapter, Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { Auth } from './auth';
import { IUser } from '@src/domain/interfaces';

describe('auth.ts', () => {
  const user: IUser = {
    id: Uuid.v4(),
    name: Generator.randomName(),
    password: Generator.randomPassword(),
    isActive: true,
    birdDate: new Date().toISOString(),
    phone: Generator.randomPhone(),
    role: 'admin',
    username: Generator.randomUsername(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should verify token (validateJwt)', async () => {
    const mockUserDatasource = {
      getById: jest.fn().mockResolvedValue({ user }),
    } as unknown as UserDatasource;

    const token = await JwtAdapter.generateToken({
      payload: { id: user.id },
    });

    const auth = new Auth(mockUserDatasource);

    const res = jest.fn() as any;
    const next = jest.fn();
    const req = {
      body: {},
      header: jest.fn().mockReturnValue('Bearer ' + token),
    } as any;

    await auth.validateJwt(req, res, next);

    expect(res).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('should return 401 status if there is not authentication header', async () => {
    const mockUserDatasource = {
      getById: jest.fn().mockResolvedValue({ user }),
    } as unknown as UserDatasource;

    const auth = new Auth(mockUserDatasource);

    const next = jest.fn();
    const req = { header: jest.fn().mockReturnValue(undefined) } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await auth.validateJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Token not provided'],
    });
  });

  test('should return 401 status if there is not bearer token', async () => {
    const mockUserDatasource = {
      getById: jest.fn().mockResolvedValue({ user }),
    } as unknown as UserDatasource;

    const auth = new Auth(mockUserDatasource);

    const next = jest.fn();
    const req = { header: jest.fn().mockReturnValue('no bearer token') } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await auth.validateJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['invalid Bearer Token'],
    });
  });

  test('should return 401 status if payload is invalid', async () => {
    const token = 'token';

    const mockUserDatasource = {
      getById: jest.fn().mockResolvedValue({ user }),
    } as unknown as UserDatasource;

    const auth = new Auth(mockUserDatasource);

    const next = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const req = {
      body: {},
      header: jest.fn().mockReturnValue('Bearer ' + token),
    } as any;

    await auth.validateJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Invalid Token'],
    });
  });

  test('should return 401 status if user is not active (validateJwt)', async () => {
    const mockUserDatasource = {
      getById: jest
        .fn()
        .mockResolvedValue({ user: { ...user, isActive: false } }),
    } as unknown as UserDatasource;

    const token = await JwtAdapter.generateToken({
      payload: { id: user.id },
    });

    const auth = new Auth(mockUserDatasource);

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    const req = {
      body: {},
      header: jest.fn().mockReturnValue('Bearer ' + token),
    } as any;

    await auth.validateJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['user not active'],
    });
  });

  test('should verify role correctly (verifyRole)', () => {
    const next = jest.fn();
    const req = { body: { user: { role: 'admin' } } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    Auth.verifyRole(['admin'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return 401 if user not exist (verifyRole)', () => {
    const next = jest.fn();
    const req = { body: { user: undefined } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    Auth.verifyRole(['admin'])(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['resource user not allow'],
    });
  });

  test('should return 403 if user not have role properly (verifyRole)', () => {
    const next = jest.fn();
    const req = { body: { user: { role: 'admin' } } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    Auth.verifyRole(['cafe', 'laundry'])(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['resource forbidden for the user'],
    });
  });
});
