import { CreateRoom } from '@domain/interfaces';
import { CreateRoomDto } from './create-room.dto';

describe('create-room.dto.ts', () => {
  it('should create an instance of CreateRoomDto', () => {
    const data: CreateRoom = {
      roomType: 'suit',
      roomNumber: 12,
      betsNumber: 12,
      isAvailable: false,
    };

    const [errors, result] = CreateRoomDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(CreateRoomDto);
    expect(result).toEqual(expect.objectContaining(data));
  });

  it('should get error if properties are wrong', () => {
    const data: CreateRoom = {
      roomType: 'suitaa' as any,
      roomNumber: -12,
      betsNumber: -12,
      isAvailable: 12 as any,
    };
    const [errors, result] = CreateRoomDto.create(data);

    expect(result).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'betsNumber property most be greater than or equal to 1',
      'roomNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
      'roomType most be: suit, normal',
    ]);
  });
});
