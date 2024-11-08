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

export interface BookingPagination {
  bookings: IBooking[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type CreateBooking = Omit<IBooking, 'id' | 'createdAt'>;
export type UpdateBooking = Partial<CreateBooking> & { id: string };
export type FilterBooking = Partial<Omit<IBooking, 'id' | 'description'>>;
export type IFilterBookingDto = Partial<
  Omit<FilterBooking, 'checkIn' | 'checkOut' | 'createdAt'>
> & {
  createdAt?: Date | { gte: Date; lt: Date };
  checkIn?: Date | { gte: Date; lt: Date };
  checkOut?: Date | { gte: Date; lt: Date };
};
