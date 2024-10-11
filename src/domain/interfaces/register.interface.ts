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

export type RegisterFilter = Partial<Pick<IRegister, keyof IRegister>>;

export type CreateRegister = Omit<
  IRegister,
  'id' | 'guestsNumber' | 'checkIn'
> & {
  guestsNumber?: number;
};
export type UpdateRegister = Partial<CreateRegister> & { id: string };
