import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Generator } from '@src/utils/generator';
import { JwtAdapter } from '@src/adapters';

describe('auth.controller.ts', () => {
  test('should login correctly (login)', async () => {
    const body = {
      username: Generator.randomUsername().trim().toLocaleLowerCase(),
      password: Generator.randomPassword().trim(),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const req = { body } as unknown as Request;

    const service = {
      login: jest.fn().mockResolvedValue({ ok: true, token: 'token' }),
    } as unknown as AuthService;

    const controller = new AuthController(service);

    await controller.login(req, res);

    expect(service.login).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true, token: 'token' });
  });

  test('should throw an error when login fails (login)', async () => {
    const body = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const req = { body } as unknown as Request;

    const service = { login: jest.fn() } as unknown as AuthService;

    const controller = new AuthController(service);

    await controller.login(req, res);

    expect(service.login).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: [
        'username property is required',
        'password property is required',
      ],
    });
  });

  test('should refresh token correctly (refreshToken)', async () => {
    const token = await JwtAdapter.generateToken({ payload: { id: 'token' } });
    const body = { token };
    const req = { body } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const service = {
      refreshToken: jest.fn().mockResolvedValue({ token }),
    } as unknown as AuthService;
    const controller = new AuthController(service);

    await controller.refreshToken(req, res);

    expect(service.refreshToken).toHaveBeenCalledWith(body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
  });

  test('should throw error if token not valid (refreshToken)', async () => {
    const req = { body: { token: '' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const service = {
      refreshToken: jest.fn().mockResolvedValue({}),
    } as unknown as AuthService;
    const controller = new AuthController(service);

    await controller.refreshToken(req, res);

    expect(service.refreshToken).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['token not valid'],
    });
  });
});
