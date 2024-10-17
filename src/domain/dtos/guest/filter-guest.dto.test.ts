import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { variables } from '@domain/variables';
import { Generator } from '@src/utils/generator';
import { FilterGuestDto } from '.';
import { GuestFilter } from '@src/domain/interfaces';

describe('filter-guest.dto.ts', () => {
  it('should create and instance of FilterGuestDto', () => {
    const fullName = Generator.randomName();
    const data: GuestFilter = {
      di: Generator.randomIdentityNumber(),
      city: Generator.randomCity(citiesList).toLowerCase(),
      name: fullName.split(' ').at(0)!.toLowerCase(),
      lastName: fullName.split(' ').at(1)!.toLowerCase(),
      phone: Generator.randomPhone(),
      roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
      countryId: 'BO',
      registerId: Uuid.v4(),
      dateOfBirth: Generator.randomDate(),
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
    };
    const [errors, filterDto] = FilterGuestDto.create(data);

    expect(errors).toBeUndefined();
    expect(filterDto).toBeInstanceOf(FilterGuestDto);
    expect(filterDto).toEqual(
      expect.objectContaining({
        ...data,
        dateOfBirth: expect.any(Date),
        checkIn: expect.any(Date),
        checkOut: expect.any(Date),
      })
    );
  });

  it('should get all properties as optional', () => {
    const data: GuestFilter = {};
    const [errors, filterDto] = FilterGuestDto.create(data);

    expect(errors).toBeUndefined();
    expect(filterDto).toBeInstanceOf(FilterGuestDto);
  });

  it('should get error if properties are wrong', () => {
    const data = {
      di: 'false',
      city: 34,
      name: true,
      lastName: 12,
      phone: 'new Date()',
      roomNumber: -4,
      countryId: 'B',
      registerId: 'Uuid.v4()',
      dateOfBirth: 'Generator.randomDate()',
      checkIn: 'Generator.randomDate()',
      checkOut: 'Generator.randomDate()',
    };

    const [errors, filterDto] = FilterGuestDto.create(data);

    expect(filterDto).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toEqual([
      'city property most be a string',
      'name property most be a string',
      'lastName property most be a string',
      'phone property most have a valid format',
      'roomNumber property most be greater than or equal to 1',
      'countryId not valid',
      'registerId is not a valid uuid',
      'dateOfBirth property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      'checkOut property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
    ]);
  });
});
