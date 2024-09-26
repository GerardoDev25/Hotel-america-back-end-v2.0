import { IGuest } from '@domain/interfaces';
import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { Generator } from '@src/utils/generator';
import { variables } from '@domain/variables';
import { GuestEntity } from '.';

describe('guest.entity.ts', () => {
  const fullName = Generator.randomName();

  const guestValid: IGuest = {
    id: Uuid.v4(),
    di: Generator.randomIdentityNumber(),
    checkIn: Generator.randomDate(),
    dateOfBirth: Generator.randomDate(),
    city: Generator.randomCity(citiesList),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    phone: Generator.randomPhone(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    countryId: 'BO',
    registerId: Uuid.v4(),
  };

  test('should get valid guest with valid object', () => {
    const result = GuestEntity.fromObject(guestValid);
    expect(result).toBeInstanceOf(GuestEntity);
  });

  test('should throw error register with invalid properties', () => {
    const invalidId = 'invalid uuid';
    const invalidDi = true;
    const invalidCheckIn = 'Generator.randomDate()';
    const invalidDateOfBirth = 'Generator.randomDate()';
    const invalidCity = new Date();
    const invalidName = 12;
    const invalidLastName = false;
    const invalidPhone = 'Generator.randomPhone()';
    const invalidRoomNumber = 'variables.ROOM_NUMBER_MIN_VALUE';
    const invalidCountryId = 'invalid uuid';
    const invalidRegisterId = 'invalid uuid';

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, id: invalidId })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, di: invalidDi })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, checkIn: invalidCheckIn })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, dateOfBirth: invalidDateOfBirth })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, city: invalidCity })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, name: invalidName })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, lastName: invalidLastName })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, phone: invalidPhone })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, roomNumber: invalidRoomNumber })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, countryId: invalidCountryId })
    ).toThrow();

    expect(() =>
      GuestEntity.fromObject({ ...guestValid, registerId: invalidRegisterId })
    ).toThrow();
  });
});
