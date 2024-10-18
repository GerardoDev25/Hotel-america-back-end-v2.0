import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { FilterRegisterDto } from '.';
import { RegisterFilter } from '@domain/interfaces';

describe('filter-register.dto.ts', () => {
  it('should create an instance if FilterRegisterDto', () => {
    const data: RegisterFilter = {
      checkOut: Generator.randomDate(),
      checkIn: Generator.randomDate(),
      guestsNumber: 4,
      discount: 0,
      price: 302,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const [errors, updateRegister] = FilterRegisterDto.create(data);
    const checkOut =
      data.checkOut !== undefined ? new Date(data.checkOut) : undefined;
    const checkIn =
      data.checkIn !== undefined ? new Date(data.checkIn) : undefined;

    expect(errors).toBeUndefined();
    expect(updateRegister).toBeInstanceOf(FilterRegisterDto);
    expect(updateRegister).toEqual(
      expect.objectContaining({ ...data, checkOut, checkIn })
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

    const [errors, updateRegister] = FilterRegisterDto.create(data);

    expect(updateRegister).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'discount property most be a number',
      'userId is not a valid uuid',
      'roomId is not a valid uuid',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });
});
