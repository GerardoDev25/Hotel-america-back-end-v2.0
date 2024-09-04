import { Request, Response } from 'express';
import { CheckDataRoom } from './check-data-room';

describe('CREATE check-data-room.ts', () => {
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
        roomType: 'suit',
        roomNumber: 1,
        betsNumber: 1,
        isAvailable: true,
      },
    } as Request;

    CheckDataRoom.create(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return error when isAvailable property is not boolean', () => {
    const req = {
      body: {
        roomType: 'suit',
        roomNumber: 1,
        betsNumber: 1,
        isAvailable: 'not bool',
      },
    } as any;

    CheckDataRoom.create(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['isAvailable property most be a boolean'],
    });
  });

  test('should return error when properties are missing', () => {
    const req = { body: {} } as any;

    CheckDataRoom.create(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: [
        'roomType property is required',
        'roomNumber property is required',
        'betsNumber property is required',
      ],
    });
  });
});

describe('UPDATE check-data-room.ts', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get all properties as optional but id required', () => {
    // const req = { body: { id: '123e4567-e89b-12d3-a456-426614174000' } } as any;
    // const req = { body: { id: '1896af4a2-e09a-4f58-8092-8cd95e80b589' } } as any;
    const req = { body: { id: '896af4a2-e09a-4f58-8092-8cd95e80b589' } } as any;

    CheckDataRoom.update(req, res, next);
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

    CheckDataRoom.update(req, res, next);
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
        id: '896af4a2-e09a-4f58-8092-8cd95e80b589',
        roomType: 'not-suit',
        roomNumber: true,
        betsNumber: 'ab',
        isAvailable: 'not bool',
      },
    } as any;

    CheckDataRoom.update(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: [
        'roomType most be: suit, normal',
        'roomNumber property most be a number',
        'betsNumber property most be a number',
        'isAvailable property most be a boolean',
      ],
    });
  });
});
