import { UpdateRoom } from '@domain/interfaces';
import { Uuid } from '@src/adapters';
import { UpdateRoomDto } from './update-room.dto';

describe('update-room.dto.ts', () => {
  it('should create an instance of UpdateRoomDto', () => {
    const data = {
      id: Uuid.v4(),
      roomType: 'suit',
      roomNumber: 12,
      betsNumber: 12,
      isAvailable: false,
    };

    const [errors, result] = UpdateRoomDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(UpdateRoomDto);
    expect(result).toEqual(data);
  });

  it('should have all the properties as optional except id', () => {
    const data = {
      id: Uuid.v4(),
    };

    const [errors, result] = UpdateRoomDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(UpdateRoomDto);
    expect(result).toEqual(expect.objectContaining(data));
  });

  it('should get error if properties are wrong', () => {
    const data: UpdateRoom = {
      id: 'no valid uuid',
      roomType: 'suitaa' as any,
      roomNumber: -12,
      betsNumber: -12,
      isAvailable: 12 as any,
    };
    const [errors, result] = UpdateRoomDto.create(data);

    expect(result).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'roomType most be: suit, normal',
      'roomNumber property most be greater than or equal to 1',
      'betsNumber property most be greater than or equal to 1',
      'isAvailable property most be a boolean',
      'id is not a valid uuid',
    ]);
  });
});
