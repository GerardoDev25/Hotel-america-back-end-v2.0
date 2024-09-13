import { Uuid } from '../../../adapters';
import { CreateRoom, UpdateRoom } from '../../interfaces';
import { RoomValidator } from './room-validator-dtos';

describe('RoomValidator', () => {
  it('should get empty array if pass a valid object create()', () => {
    const data: CreateRoom = {
      roomNumber: 102,
      betsNumber: 3,
      roomType: 'suit',
      isAvailable: false,
    };

    const errors = RoomValidator.create(data);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong create()', () => {
    const data: CreateRoom = {
      roomNumber: -2,
      betsNumber: -1,
      roomType: 'suitass' as any,
      isAvailable: 4 as any,
    };

    const errors = RoomValidator.create(data);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'betsNumber property most be greater than or equal to 1',
      'roomNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
      'roomType most be: suit, normal',
    ]);
  });

  it('should get empty array if pass a valid object update()', () => {
    const data: UpdateRoom = {
      id: Uuid.v4(),
      roomNumber: 102,
      betsNumber: 3,
      roomType: 'suit',
      isAvailable: true,
    };

    const errors = RoomValidator.update(data);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong update()', () => {
    const data: UpdateRoom = {
      id: 'Uuid.v4()',
      roomNumber: -102,
      betsNumber: -3,
      roomType: 'suitasa' as any,
      isAvailable: 'hello' as any,
    };

    const errors = RoomValidator.update(data);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'id is not a valid uuid',
      'roomType most be: suit, normal',
      'roomNumber property most be greater than or equal to 1',
      'betsNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
    ]);
  });
});
