export interface IBooking {
  id: string;
  createdAt: string;
  amount: number;
  description: string;
  name: string;
  guestsNumber: number;
  checkIn: string;
  checkOut?: string;
  roomNumber?: number;
}

export type CreateBooking = Omit<IBooking, 'id' | 'createdAt'>;
export type UpdateBooking = Partial<CreateBooking> & { id: number };
