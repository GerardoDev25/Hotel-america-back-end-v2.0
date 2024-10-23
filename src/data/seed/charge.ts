import { TypeCharge } from '@prisma/client';

type Register = {
  id: string;
  guestsNumber: number;
  checkIn: Date;
  checkOut: Date | null;
  room: { roomNumber: number };
};

type Charge = {
  amount: number;
  description: string;
  type: TypeCharge;
  registerId: string;
};

const generateCharge = (register: Register) => {
  const charge: Charge = {
    amount: register.guestsNumber * 1000,
    description: 'lodging charge',
    type: 'lodging',
    registerId: register.id,
  };
  return charge;
};

export const generateChargesToDB = (registers: Register[]) => {
  const charges = [];

  for (const register of registers) {
    const charge = generateCharge(register);
    charges.push(charge);
  }

  return charges;
};
