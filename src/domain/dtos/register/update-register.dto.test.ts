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

    const [_, updateRegister] = UpdateRegisterDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;
    const checkIn = data.checkIn ? new Date(data.checkIn) : undefined;

    expect(updateRegister).toBeInstanceOf(UpdateRegisterDto);
    expect(updateRegister).toEqual(
      expect.objectContaining({ ...data, checkIn, checkOut })
    );
  });

  it('should get error if properties are wrong', () => {
    const data = {
      id: 'no valid uuid',
      checkIn: 'no valid date',
      checkOut: 'no valid date',
      guestsNumber: '4',
      discount: true,
      price: null,
      userId: 'no valid uuid',
      roomId: 'no valid uuid',
    };

    const [errors] = UpdateRegisterDto.create(data);

    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'id is not a valid uuid',
      'discount property most be a number',
      'userId is not a valid uuid',
      'roomId is not a valid uuid',
      'checkIn property most be a valid date',
      'checkOut property most be a valid date',
    ]);
  });
});
