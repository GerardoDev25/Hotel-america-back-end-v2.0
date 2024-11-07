import { Uuid } from '@src/adapters';
import { UpdateBooking } from '@domain/interfaces';
import { Generator } from '@src/utils/generator';
import { UpdateBookingDto } from '.';

describe('update-booking.dto.ts', () => {
  it('should get everything optional but id required (update)', () => {
    const data: UpdateBooking = {
      id: Uuid.v4(),
    };

    const [errors, dto] = UpdateBookingDto.create(data);

    expect(errors).toBeUndefined();
    expect(dto).toBeInstanceOf(UpdateBookingDto);
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

    const [errors, dto] = UpdateBookingDto.create(data);

    expect(errors).toBeUndefined();
    expect(dto).toBeInstanceOf(UpdateBookingDto);
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

    const [errors, dto] = UpdateBookingDto.create(data);

    expect(dto).toBeUndefined();
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
