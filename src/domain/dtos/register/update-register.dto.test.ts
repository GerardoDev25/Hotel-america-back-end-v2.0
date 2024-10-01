import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { UpdateRegisterDto } from './update-register.dto';

describe('update-register.dto.ts', () => {
  test('should create an instance if UpdateRegisterDto', () => {
    const data = {
      id: Uuid.v4(),
      checkOut: Generator.randomDate(),
      guestsNumber: 4,
      discount: 0,
      price: 302,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const [errors, updateRegister] = UpdateRegisterDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(errors).toBeUndefined();
    expect(updateRegister).toBeInstanceOf(UpdateRegisterDto);
    expect(updateRegister).toEqual(
      expect.objectContaining({ ...data, checkOut })
    );
  });

  it('should get error if properties are wrong', () => {
    const data = {
      id: 'no valid uuid',
      checkOut: 'no valid date',
      guestsNumber: '4',
      discount: true,
      price: null,
      userId: 'no valid uuid',
      roomId: 'no valid uuid',
    };

    const [errors, updateRegister] = UpdateRegisterDto.create(data);

    expect(updateRegister).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'id is not a valid uuid',
      'discount property most be a number',
      'userId is not a valid uuid',
      'roomId is not a valid uuid',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });
});
