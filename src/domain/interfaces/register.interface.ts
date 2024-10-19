export interface IRegister {
  id: string;
  checkIn: string;
  checkOut?: string;
  guestsNumber: number;
  discount: number;
  price: number;
  userId: string;
  roomId: string;
}

export interface RegisterCheckOutDB {
  id: string;
  checkIn: Date;
  checkOut: Date | null;
  discount: number;
  price: number;
  totalCharges: number;
  totalPayments: number;
  Guest: {
    name: string;
    di: string;
    dateOfBirth: Date;
    city: string;
    lastName: string;
    phone: string;
    country: { name: string };
  }[];
  room: { roomNumber: number };
  Charge: {
    amount: number;
    description: string;
    createdAt: Date;
  }[];
  Payment: {
    amount: number;
    description: string;
    paidAt: Date;
  }[];
}
export interface RegisterCheckOut {
  id: string;
  checkIn: string;
  checkOut?: string;
  discount: number;
  price: number;
  roomNumber: number;
  totalCharges: number;
  totalPayments: number;
  guests: GuestCheckOut[];
  charges: ChargeCheckOut[];
  payments: PaymentCheckOut[];
}

interface ChargeCheckOut {
  amount: number;
  description?: string;
  createdAt: string;
}

interface PaymentCheckOut {
  amount: number;
  description?: string;
  paidAt: string;
}

interface GuestCheckOut {
  di: string;
  dateOfBirth: string;
  city: string;
  name: string;
  lastName: string;
  phone: string;
  country: string;
}

export interface RegisterPagination {
  registers: IRegister[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type RegisterFilter = Partial<Omit<IRegister, 'id'>>;
export type IRegisterFilterDto = Omit<
  RegisterFilter,
  'checkIn' | 'checkOut'
> & {
  checkIn?: Date | { gte: Date };
  checkOut?: Date | { gte: Date };
};

export type CreateRegister = Omit<
  IRegister,
  'id' | 'guestsNumber' | 'checkIn'
> & {
  guestsNumber?: number;
};
export type UpdateRegister = Partial<CreateRegister> & { id: string };
