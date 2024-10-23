import { TypePayment } from '@prisma/client';

type Register = {
  id: string;
  guestsNumber: number;
  checkIn: Date;
  checkOut: Date | null;
  room: { roomNumber: number };
};

type Payment = {
  amount: number;
  description: string;
  type: TypePayment;
  registerId: string;
};

const generatePayment = (register: Register) => {
  const payment: Payment = {
    amount: register.guestsNumber * 1000,
    description: 'lodging payment',
    type: 'cash',
    registerId: register.id,
  };
  return payment;
};

export const generatePaymentsToDB = (registers: Register[]) => {
  const payments = [];

  for (const register of registers) {
    const payment = generatePayment(register);
    payments.push(payment);
  }

  return payments;
};
