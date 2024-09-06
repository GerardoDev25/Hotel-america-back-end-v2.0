import { Request } from 'express';
import { CheckDataUser } from './check-data-user';
import {
  generateRandomDate,
  generateRandomName,
  generateRandomPassword,
  generateRandomPhone,
  generateRandomUsername,
} from '../../../utils/generator';
import { Uuid } from '../../../adapters';

describe('CREATE check-data-user.ts', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call next() when all inputs are valid', () => {
    const req = {
      body: {
        birdDate: generateRandomDate(),
        name: generateRandomName(),
        password: generateRandomPassword(),
        phone: generateRandomPhone(),
        role: 'admin',
        username: generateRandomUsername(),
        isActive: true,
      },
    } as Request;

    CheckDataUser.create(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return error when isActive property is not boolean', () => {
    const req = {
      body: {
        birdDate: generateRandomDate(),
        name: generateRandomName(),
        password: generateRandomPassword(),
        phone: generateRandomPhone(),
        role: 'admin',
        username: generateRandomUsername(),
        isActive: 12,
      },
    } as any;

    CheckDataUser.create(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['isActive property most be a boolean'],
    });
  });

  test('should return error when properties are missing', () => {
    const req = { body: {} } as any;

    CheckDataUser.create(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: [
        'role property is required',
        'birdDate property is required',
        'name property is required',
        'phone property is required',
        'username property is required',
        'password property is required',
      ],
    });
  });
});

describe('UPDATE check-data-user.ts', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get all properties as optional but id required', () => {
    const req = { body: { id: Uuid.v4() } } as any;

    CheckDataUser.update(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should valid id', () => {
    const req = { body: { id: true } } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const next = jest.fn();

    CheckDataUser.update(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['id property most be a string'],
    });
  });

  test('should check properties if comes', () => {
    const req = {
      body: {
        id: Uuid.v4(),
        birdDate: 'not-valid-date',
        name: 12,
        password: 21,
        phone: true,
        role: false,
        username: null,
        isActive: true,
      },
    } as any;

    CheckDataUser.update(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: [
        'role property most be a string',
        'birdDate property most be a valid date',
        'name property most be a string',
        'phone property most be a string',
        'username property most be a string',
        'password property most be a string',
      ],
    });
  });
});
