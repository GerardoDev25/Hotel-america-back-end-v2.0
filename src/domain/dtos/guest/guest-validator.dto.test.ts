import { Generator } from '@src/utils/generator';
import { variables } from '@domain/variables';
import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { GuestValidator } from './';

describe('guest-validator.dto.ts', () => {
  it('should get empty array if pass a valid object (create)', () => {
    const fullName = Generator.randomName();
    const data = {
      di: Generator.randomIdentityNumber(),
      city: Generator.randomCity(citiesList),
      name: fullName.split(' ').at(0)!,
      lastName: fullName.split(' ').at(1)!,
      phone: Generator.randomPhone(),
      roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
      countryId: 'BO',
      registerId: Uuid.v4(),
      dateOfBirth: Generator.randomDate(),
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
    };
    const errors = GuestValidator.create(data);
    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong (create)', () => {
    const data = {
      di: 'false',
      city: 'undefined',
      name: 'true',
      lastName: '12',
      phone: 'new Date()',
      roomNumber: -4,
      countryId: 'B',
      registerId: 'Uuid.v4()',
      dateOfBirth: 'Generator.randomDate()',
      checkIn: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
    };
    const errors = GuestValidator.create(data);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('countryId not valid');
    expect(errors).toContain('registerId is not a valid uuid');
    expect(errors).toContain('phone property most have a valid format');
    expect(errors).toContain(
      'roomNumber property most be greater than or equal to 1'
    );
    expect(errors).toContain(
      'dateOfBirth property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
    expect(errors).toContain(
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
    expect(errors).toContain(
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
  });

  it('should get everything optional but id required (update)', () => {
    const data = {
      id: Uuid.v4(),
    };

    const errors = GuestValidator.update(data);

    expect(errors.length).toBe(0);
  });

  it('should get empty array if pass a valid object (update)', () => {
    const fullName = Generator.randomName();
    const data = {
      id: Uuid.v4(),
      di: Generator.randomIdentityNumber(),
      city: Generator.randomCity(citiesList),
      name: fullName.split(' ').at(0)!,
      lastName: fullName.split(' ').at(1)!,
      phone: Generator.randomPhone(),
      roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
      countryId: 'BO',
      registerId: Uuid.v4(),
      dateOfBirth: Generator.randomDate(),
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
    };

    const errors = GuestValidator.update(data);

    expect(errors.length).toBe(0);
  });

  it('should get error if properties are wrong (update)', () => {
    const data = {
      id: 'Uuid.v4()',
      di: 'false',
      city: 'undefined',
      name: 'true',
      lastName: '12',
      phone: 'new Date()',
      roomNumber: -4,
      countryId: 'B',
      registerId: 'Uuid.v4()',
      dateOfBirth: 'Generator.randomDate()',
      checkIn: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
    };
    const errors = GuestValidator.update(data);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('id is not a valid uuid');
    expect(errors).toContain('countryId not valid');
    expect(errors).toContain('registerId is not a valid uuid');
    expect(errors).toContain('phone property most have a valid format');
    expect(errors).toContain(
      'roomNumber property most be greater than or equal to 1'
    );
    expect(errors).toContain(
      'dateOfBirth property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
    expect(errors).toContain(
      'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
    expect(errors).toContain(
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
  });
});
