import { Uuid } from '../../../adapters';
import { generateRandomDate } from '../../../utils/generator';
import { CreateRegisterDto } from './create-register.dto';

describe('create-register.dto.ts', () => {
  it('should create and instance of CreateRegisterDto', () => {
    const data = {
      checkIn: generateRandomDate(),
      checkOut: generateRandomDate(),
      guestsNumber: 4,
      discount: 0,
      price: 302,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const result = CreateRegisterDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(result).toBeInstanceOf(CreateRegisterDto);
    expect(result).toEqual(
      expect.objectContaining({
        ...data,
        checkIn: new Date(data.checkIn),
        checkOut,
      })
    );
  });
});
