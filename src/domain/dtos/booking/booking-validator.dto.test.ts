import {
  CreateBooking,
  FilterBooking,
  UpdateBooking,
} from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { BookingValidator } from '.';
import { Uuid } from '@src/adapters';

describe('booking-validator.dto.ts', () => {
  it('should get empty array if pass a valid object (create)', () => {
    const dto: CreateBooking = {
      amount: 10,
      description: 'test',
      name: 'test',
      guestsNumber: 10,
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      roomNumber: 10,
    };

    const errors = BookingValidator.create(dto);

    expect(errors.length).toBe(0);
  });

  it('should get checkOut roomNumber as optional (create)', () => {
    const dto: CreateBooking = {
      amount: 10,
      description: 'test',
      name: 'test',
      guestsNumber: 10,
      checkIn: Generator.randomDate(),
    };

    const errors = BookingValidator.create(dto);

    expect(errors.length).toBe(0);
  });

  it('should get error if pass invalid object (create)', () => {
    const dto = {
      amount: '10',
      description: false,
      name: 23,
      guestsNumber: 'test',
      checkIn: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
      roomNumber: '10',
    } as any;

    const errors = BookingValidator.create(dto);

    expect(errors).toEqual([
      'guestsNumber property most be a number',
      'name property most be a string',
      'description property most be a string',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });

  it('should get everything optional (filter)', () => {
    const data = {};
    const errors = BookingValidator.filter(data);
    expect(errors.length).toBe(0);
  });

  it('should get empty array if pass a valid object (filter)', () => {
    const dto: FilterBooking = {
      amount: 10,
      name: 'test',
      guestsNumber: 10,
      checkIn: Generator.randomDate(),
      createdAt: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      roomNumber: 10,
    };

    const errors = BookingValidator.filter(dto);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are grown (filter)', () => {
    const dto = {
      amount: 'new Date()',
      name: 12,
      guestsNumber: 'new Date()',
      checkIn: 'Generator.randomDate()',
      createdAt: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
      roomNumber: 'new Date()',
    } as any;

    const errors = BookingValidator.filter(dto);

    expect(errors).toEqual([
      'amount property most be a number',
      'guestsNumber property most be a number',
      'name property most be a string',
      'roomNumber property most be a number',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'createdAt property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });

  it('should get everything optional but id required (update)', () => {
    const data: UpdateBooking = {
      id: Uuid.v4(),
    };

    const errors = BookingValidator.update(data);

    expect(errors.length).toBe(0);
  });

  it('should get no errors if pass valid object (update)', () => {
    const data: UpdateBooking = {
      id: Uuid.v4(),
      amount: 10,
      description: 'test',
      name: 'test',
      guestsNumber: 10,
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      roomNumber: 10,
    };

    const errors = BookingValidator.update(data);

    expect(errors.length).toBe(0);
  });

  it('should get errors if pass an invalid object (update)', () => {
    const data = {
      id: 'Uuid.v4()',
      amount: '10a',
      description: 122,
      name: 565,
      guestsNumber: '10a',
      checkIn: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
      roomNumber: '10a',
    } as any;

    const errors = BookingValidator.update(data);

    expect(errors).toEqual([
      'amount property most be a number',
      'guestsNumber property most be a number',
      'name property most be a string',
      'roomNumber property most be a number',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'id is not a valid uuid',
      'description property most be a string',
    ]);
  });
});
