import { Uuid } from '../../../adapters';
import { Generator } from '../../../utils/generator';
import { UpdateRegisterDto } from './update-register.dto';

describe('update-register.dto.ts', () => {
  test('should create an instance if UpdateRegisterDto', () => {
    const data = {
      id: Uuid.v4(),
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      guestsNumber: 4,
      discount: 0,
      price: 302,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const result = UpdateRegisterDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;
    const checkIn = data.checkIn ? new Date(data.checkIn) : undefined;

    expect(result).toBeInstanceOf(UpdateRegisterDto);
    expect(result).toEqual(
      expect.objectContaining({ ...data, checkIn, checkOut })
    );
  });
});
