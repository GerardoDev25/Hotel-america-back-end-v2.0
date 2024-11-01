import { RoomFilter } from '@domain/interfaces';
import { FilterRoomDto } from './';

describe('filter-room.dto.ts', () => {
  it('should create an instance of FilterRoomDto', () => {
    const data = {
      roomType: 'suit',
      roomNumber: 12,
      betsNumber: 12,
      isAvailable: false,
    };

    const [errors, result] = FilterRoomDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(FilterRoomDto);
    expect(result).toEqual(data);
  });

  it('should have all the properties as optional', () => {
    const data = {};

    const [errors, result] = FilterRoomDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(FilterRoomDto);
    expect(result).toEqual(expect.objectContaining(data));
  });

  it('should get error if properties are wrong', () => {
    const data: RoomFilter = {
      roomType: 'suitaa' as any,
      roomNumber: -12,
      betsNumber: -12,
      isAvailable: 12 as any,
    };
    const [errors, result] = FilterRoomDto.create(data);

    expect(result).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'roomType most be: normal, suit',
      'roomNumber property most be greater than or equal to 1',
      'betsNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
    ]);
  });
});
