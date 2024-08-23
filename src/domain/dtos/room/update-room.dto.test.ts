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

    const result = UpdateRoomDto.create(data);

    expect(result).toBeInstanceOf(UpdateRoomDto);
    expect(result).toEqual(data);
  });

  test('should have all the properties as optional except id', () => {
    const data = {
      id: 'd9bbb473-09fa-4cc1-98ad-b2405550606f',
    };

    const result = UpdateRoomDto.create(data);

    expect(result).toBeInstanceOf(UpdateRoomDto);
    expect(result).toEqual(expect.objectContaining(data));
  });
});
