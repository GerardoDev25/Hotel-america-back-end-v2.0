import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { variables } from '@domain/variables';
import { Generator } from '@src/utils/generator';
import { UpdateGuestDto } from './';

describe('update-guest.dto.ts', () => {
  it('should create and instance of UpdateGuestDto', () => {
    const fullName = Generator.randomName();
    const data = {
      id: Uuid.v4(),
      di: Generator.randomIdentityNumber(),
      city: Generator.randomCity(citiesList).toLowerCase(),
      name: fullName.split(' ').at(0)!.toLowerCase(),
      lastName: fullName.split(' ').at(1)!.toLowerCase(),
      phone: Generator.randomPhone(),
      roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
      countryId: 'BO',
      registerId: Uuid.v4(),
      dateOfBirth: Generator.randomDate(),
      checkOut: Generator.randomDate(),
    };
    const [errors, updateGuestDto] = UpdateGuestDto.create(data);
    const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;

    expect(errors).toBeUndefined();
    expect(updateGuestDto).toBeInstanceOf(UpdateGuestDto);
    expect(updateGuestDto).toEqual(
      expect.objectContaining({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        checkOut,
      })
    );
  });

  it('should get all properties as optional except id', () => {
    const data = {
      id: Uuid.v4(),
    };
    const [errors, updateGuestDto] = UpdateGuestDto.create(data);

    expect(errors).toBeUndefined();
    expect(updateGuestDto).toBeInstanceOf(UpdateGuestDto);
    expect(updateGuestDto).toEqual(expect.objectContaining({ ...data }));
  });

  it('should get error if properties are wrong', () => {
    const data = {
      id: 'no valid uuid',
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

    const [errors, updateGuestDto] = UpdateGuestDto.create(data);

    expect(updateGuestDto).toBeUndefined();
    expect(errors).toBeInstanceOf(Array);
    expect(errors?.length).toBeGreaterThan(0);
    expect(errors).toContain('countryId not valid');
    expect(errors).toContain('id is not a valid uuid');
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
