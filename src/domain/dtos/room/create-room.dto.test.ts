import { CreateRoomDto } from './create-room.dto';

describe('create-room.dto.ts', () => {
  test('should create an instance of CreateRoomDto', () => {
    const data = {
      roomType: 'suit',
      roomNumber: 12,
      betsNumber: 12,
      isAvailable: false,
    };

    const result = CreateRoomDto.create(data);

    expect(result).toBeInstanceOf(CreateRoomDto);
    expect(result).toEqual(expect.objectContaining(data));
  });
});
