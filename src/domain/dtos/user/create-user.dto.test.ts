import { CreateUserDto } from './create-user.dto';

describe('create-room.dto.ts', () => {
  test('should create an instance of CreateRoomDto', () => {
    const data = {
      roomType: 'suit',
      roomNumber: 12,
      betsNumber: 12,
      isAvailable: false,
    };

    const result = CreateUserDto.create(data);

    expect(result).toBeInstanceOf(CreateUserDto);
    expect(result).toEqual(expect.objectContaining(data));
  });
});
