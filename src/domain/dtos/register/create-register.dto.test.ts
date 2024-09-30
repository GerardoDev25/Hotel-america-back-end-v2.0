import { Generator } from '@src/utils/generator';
import { Uuid } from '@src/adapters';

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

    const [errors, registerDto] = CreateRegisterDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(errors).toBeUndefined();
    expect(registerDto).toBeInstanceOf(CreateRegisterDto);
    expect(registerDto).toEqual(
      expect.objectContaining({
        ...data,
        checkIn: new Date(data.checkIn),
        checkOut,
      })
    );
  });

  it('should receive guestsNumber as optional', () => {
    const data = {
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      discount: 0,
      price: 302,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const [errors, registerDto] = CreateRegisterDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(errors).toBeUndefined();
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

    const [errors, createRegister] = CreateRegisterDto.create(data);

    expect(createRegister).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'discount property most be a number',
      'userId is not a valid uuid',
      'roomId is not a valid uuid',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });
});
