import { FilterBooking } from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { FilterBookingDto } from '.';

describe('filter-booking.dto.ts', () => {
  it('should get everything optional (filter)', () => {
    const data = {};
    const [errors, dto] = FilterBookingDto.create(data);

    expect(errors).toBeUndefined();
    expect(dto).toBeInstanceOf(FilterBookingDto);
  });

  it('should get empty array if pass a valid object (filter)', () => {
    const data: FilterBooking = {
      amount: 10,
      name: 'test',
      guestsNumber: 10,
      checkIn: Generator.randomDate(),
      createdAt: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      roomNumber: 10,
    };
    const [errors, dto] = FilterBookingDto.create(data);

    expect(errors).toBeUndefined();
    expect(dto).toBeInstanceOf(FilterBookingDto);
  });

  it('should get error if properties are grown (filter)', () => {
    const data = {
      amount: 'new Date()',
      name: 12,
      guestsNumber: 'new Date()',
      checkIn: 'Generator.randomDate()',
      createdAt: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
      roomNumber: 'new Date()',
    } as any;

    const [errors, dto] = FilterBookingDto.create(data);

    expect(dto).toBeUndefined();
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
});
