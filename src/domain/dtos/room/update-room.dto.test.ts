import { Uuid } from '../../../adapters';
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

    const result = UpdateRoomDto.create(data);

    expect(result).toBeInstanceOf(UpdateRoomDto);
    expect(result).toEqual(data);
  });

  it('should have all the properties as optional except id', () => {
    const data = {
      id: Uuid.v4(),
    };

    const result = UpdateRoomDto.create(data);

    expect(result).toBeInstanceOf(UpdateRoomDto);
    expect(result).toEqual(expect.objectContaining(data));
  });
});
