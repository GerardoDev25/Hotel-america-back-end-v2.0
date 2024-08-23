import { UpdateRoomDto } from './update-room.dto';

describe('update-room.dto.ts', () => {
  test('should create an instance of UpdateRoomDto', () => {
    const data = {
      id: 'd9bbb473-09fa-4cc1-98ad-b2405550606f',
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

  test('should have all the properties as optional except id', () => {
    const data = {
      id: 'd9bbb473-09fa-4cc1-98ad-b2405550606f',
    };

    const [errors, result] = UpdateRoomDto.create(data);

    expect(errors).toBeUndefined();
    expect(result).toBeInstanceOf(UpdateRoomDto);
    expect(result).toEqual(expect.objectContaining(data));
  });

  test('should return and error message array if data is wrong', () => {
    const data = {
      roomType: 'not-allow',
      roomNumber: true,
      betsNumber: '12a',
      isAvailable: 50,
    };

    const [errors, result] = UpdateRoomDto.create(data);

    expect(result).toBeUndefined();
    expect(errors).toEqual([
      'id property is required',
      'roomType most be: suit, normal',
      'roomNumber property most be a number',
      'betsNumber property most be a number',
      'isAvailable property most be a boolean',
    ]);
  });
});
