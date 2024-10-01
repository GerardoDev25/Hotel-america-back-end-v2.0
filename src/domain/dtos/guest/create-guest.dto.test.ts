import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { variables } from '@domain/variables';
import { Generator } from '@src/utils/generator';
import { CreateGuestDto } from './';

describe('create-guest.dto.ts', () => {
  it('should create and instance of CreateGuestDto', () => {
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
      checkOut: Generator.randomDate(),
    };
    const [errors, guestDto] = CreateGuestDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(errors).toBeUndefined();
    expect(guestDto).toBeInstanceOf(CreateGuestDto);
    expect(guestDto).toEqual(
      expect.objectContaining({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        checkOut,
      })
    );
  });

  it('should get registerId as optional', () => {
    const fullName = Generator.randomName();
    const data = {
      di: Generator.randomIdentityNumber(),
      city: Generator.randomCity(citiesList),
      name: fullName.split(' ').at(0)!,
      lastName: fullName.split(' ').at(1)!,
      phone: Generator.randomPhone(),
      roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
      countryId: 'BO',
      dateOfBirth: Generator.randomDate(),
      checkOut: Generator.randomDate(),
    };
    const [errors, guestDto] = CreateGuestDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(errors).toBeUndefined();
    expect(guestDto).toBeInstanceOf(CreateGuestDto);
    expect(guestDto).toEqual(
      expect.objectContaining({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        checkOut,
      })
    );
  });

  it('should get error if properties are wrong', () => {
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
      checkOut: 'Generator.randomDate()',
    };

    const [errors, createGuest] = CreateGuestDto.create(data);

    expect(createGuest).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
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
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
  });
});
