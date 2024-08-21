import { CreateRoomDto } from './create-room.dto';

describe('create-room.dto.ts', () => {
  test('should create an instance of CreateRoomDto', () => {
    const data = {
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

  test('should return and error message array if data is wrong', () => {
    const data = {
      roomType: 'not-allow',
      roomNumber: true,
      betsNumber: '12a',
      isAvailable: 50,
    };

    const [errors, result] = CreateRoomDto.create(data);

    expect(result).toBeUndefined();
    expect(errors).toEqual([
      'roomType most be: suit, normal',
      'roomNumber property most be a number',
      'betsNumber property most be a number',
      'isAvailable property most be a boolean',
    ]);
  });
});
