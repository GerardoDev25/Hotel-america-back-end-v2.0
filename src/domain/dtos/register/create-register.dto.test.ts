import { Uuid } from '../../../adapters';
import { Generator } from '../../../utils/generator';
import { CreateRegisterDto } from './create-register.dto';

describe('create-register.dto.ts', () => {
  it('should create and instance of CreateRegisterDto', () => {
    const data = {
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      guestsNumber: 4,
      discount: 0,
      price: 302,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const [_, registerDto] = CreateRegisterDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(registerDto).toBeInstanceOf(CreateRegisterDto);
    expect(registerDto).toEqual(
      expect.objectContaining({
        ...data,
        checkIn: new Date(data.checkIn),
        checkOut,
      })
    );
  });
  it('should get error if properties are wrong', () => {
    const data = {
      checkIn: 'no valid date',
      checkOut: 'no valid date',
      guestsNumber: '4',
      discount: true,
      price: null,
      userId: 'no valid uuid',
      roomId: 'no valid uuid',
    };

    const [errors] = CreateRegisterDto.create(data);

    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'discount property most be a number',
      'userId is not a valid uuid',
      'roomId is not a valid uuid',
      'checkIn property most be a valid date',
      'checkOut property most be a valid date',
    ]);
  });
});
