import { CreateBooking } from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { CreateBookingDto } from '.';

describe('create-booking.dto.ts', () => {
  it('should get empty array if pass a valid object', () => {
    const data: CreateBooking = {
      amount: 10,
      description: 'test',
      name: 'test',
      guestsNumber: 10,
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      roomNumber: 10,
    };

    const [errors, dto] = CreateBookingDto.create(data);

    expect(errors).toBeUndefined();
    expect(dto).toBeInstanceOf(CreateBookingDto);
  });

  it('should get checkOut roomNumber as optional', () => {
    const data: CreateBooking = {
      amount: 10,
      description: 'test',
      name: 'test',
      guestsNumber: 10,
      checkIn: Generator.randomDate(),
    };

    const [errors, dto] = CreateBookingDto.create(data);

    expect(errors).toBeUndefined();
    expect(dto).toBeInstanceOf(CreateBookingDto);
  });

  it('should get error if pass invalid object', () => {
    const data = {
      amount: '10',
      description: false,
      name: 23,
      guestsNumber: 'test',
      checkIn: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
      roomNumber: '10',
    } as any;

    const [errors, dto] = CreateBookingDto.create(data);

    expect(dto).toBeUndefined();
    expect(errors).toEqual([
      'guestsNumber property most be a number',
      'name property most be a string',
      'description property most be a string',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });
});
