import { Uuid } from '../../adapters';
import { Generator } from '../../utils/generator';
import { IRegister } from '../interfaces';
import { RegisterEntity } from './register.entity';

describe('register.entity.ts', () => {
  const registerValid: IRegister = {
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
    guestsNumber: 3,
    discount: 0,
    price: 100,
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
  };

  test('should get valid register with valid object', () => {
    const result = RegisterEntity.fromObject(registerValid);
    expect(result).toBeInstanceOf(RegisterEntity);
  });

  test('should throw error register with invalid properties', () => {
    const invalidId = 'invalid uuid';
    const invalidCheckIn = 'invalid data';
    const invalidCheckOut = 'invalid data';
    const invalidGuestsNumber = true;
    const invalidDiscount = undefined;
    const invalidPrice = false;
    const invalidUserId = 'invalid uuid';
    const invalidRoomId = 'invalid uuid';

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidId })
    ).toThrow();

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidCheckIn })
    ).toThrow();

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidCheckOut })
    ).toThrow();

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidGuestsNumber })
    ).toThrow();

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidDiscount })
    ).toThrow();

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidPrice })
    ).toThrow();

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidUserId })
    ).toThrow();

    expect(() =>
      RegisterEntity.fromObject({ ...registerValid, id: invalidRoomId })
    ).toThrow();
  });
});
