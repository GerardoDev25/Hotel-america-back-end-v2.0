import { Generator } from '@src/utils/generator';
import { citiesList } from './city';
import { countries } from './country';

const generateGuest = (register: Registers, index: number) => {
  const di = Generator.randomIdentityNumber(8) + index;
  const dateOfBirth = new Date(
    Generator.randomDateBetween('1980-01-01', '2010-01-01')
  ).toISOString();

  const fullName = Generator.randomName();
  const checkOut = register.checkOut
    ? new Date(register.checkOut).toISOString()
    : null;

  const guest = {
    di,
    checkIn: new Date(register.checkIn).toISOString(),
    checkOut,
    dateOfBirth,
    city: Generator.randomCity(citiesList).trim().toLowerCase(),
    name: fullName.split(' ').at(0)!.trim().toLowerCase(),
    lastName: fullName.split(' ').at(1)!.trim().toLowerCase(),
    phone: Generator.randomPhone().trim(),
    roomNumber: register.room.roomNumber,
    countryId: Generator.randomCountryId(countries).trim(),
    registerId: register.id.trim(),
  };
  return guest;
};

type Registers = {
  id: string;
  guestsNumber: number;
  checkIn: Date;
  checkOut: Date | null;
  room: { roomNumber: number };
};

export const generateGuestsToDB = (registers: Registers[]) => {
  const guests = [];

  for (const register of registers) {
    for (let index = 0; index < register.guestsNumber; index++) {
      const guest = generateGuest(register, index);

      guests.push(guest);
    }
  }

  return guests;
};
