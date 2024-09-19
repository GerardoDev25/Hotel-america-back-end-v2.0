import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { RegisterValidator } from './register-validator-dtos';

describe('register-validator-dtos.ts', () => {
  it('should get empty array if pass a valid object create()', () => {
    const data = {
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      guestsNumber: 4,
      discount: 0,
      price: 302,
      userId: Uuid.v4(),
      roomId: Uuid.v4(),
    };

    const errors = RegisterValidator.create(data);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong create()', () => {
    const data = {
      checkIn: 'no valid date',
      checkOut: 'no valid date',
      guestsNumber: -4,
      discount: -4,
      price: -6,
      userId: 'no valid uuid',
      roomId: 'no valid uuid',
    };

    const errors = RegisterValidator.create(data);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'guestsNumber property most be greater than or equal to 1',
      'discount property most be a positive',
      'price property most be a positive',
      'userId is not a valid uuid',
      'roomId is not a valid uuid',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });

  it('should get empty array if pass a valid object update()', () => {
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

    const errors = RegisterValidator.update(data);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong update()', () => {
    const data = {
      id: 'no valid uuid',
      checkIn: 'no valid date',
      checkOut: 'no valid date',
      guestsNumber: -4,
      discount: -4,
      price: -6,
      userId: 'no valid uuid',
      roomId: 'no valid uuid',
    };

    const errors = RegisterValidator.update(data);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'id is not a valid uuid',
      'guestsNumber property most be greater than or equal to 1',
      'discount property most be a positive',
      'price property most be a positive',
      'userId is not a valid uuid',
      'roomId is not a valid uuid',
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });
});
