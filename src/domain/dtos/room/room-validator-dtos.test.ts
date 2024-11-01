import { CreateRoom, RoomFilter, UpdateRoom } from '@domain/interfaces';
import { Uuid } from '@src/adapters';
import { RoomValidator } from './room-validator-dtos';

describe('RoomValidator', () => {
  it('should get empty array if pass a valid object create()', () => {
    const data: CreateRoom = {
      roomNumber: 102,
      betsNumber: 3,
      roomType: 'suit',
      isAvailable: false,
      state: 'pending_cleaning',
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
      state: 'pending_cle' as any,
    };

    const errors = RoomValidator.create(data);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'betsNumber property most be greater than or equal to 1',
      'roomNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
      'state most be: free, occupied, pending_cleaning, under_maintenance',
      'roomType most be: normal, suit',
    ]);
  });

  it('should get empty array if pass a valid object filter()', () => {
    const data: RoomFilter = {
      roomNumber: 102,
      betsNumber: 3,
      roomType: 'suit',
      isAvailable: true,
    };

    const errors = RoomValidator.filter(data);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong filter()', () => {
    const data: RoomFilter = {
      roomNumber: -102,
      betsNumber: -3,
      roomType: 'suitasa' as any,
      isAvailable: 'hello' as any,
    };

    const errors = RoomValidator.filter(data);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'roomType most be: normal, suit',
      'roomNumber property most be greater than or equal to 1',
      'betsNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
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
      'roomType most be: normal, suit',
      'roomNumber property most be greater than or equal to 1',
      'betsNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
      'id is not a valid uuid',
    ]);
  });
});
