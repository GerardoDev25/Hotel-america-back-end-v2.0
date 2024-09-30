export interface IGuest {
  id: string;
  di: string;
  checkIn: string;
  checkOut?: string;
  dateOfBirth: string;
  city: string;
  name: string;
  lastName: string;
  phone: string;
  roomNumber: number;
  countryId: string;
  registerId: string;
}

export interface GuestPagination {
  guests: IGuest[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type CreateGuest = Omit<IGuest, 'id' | 'registerId'> & {
  registerId?: string;
};
export type UpdateGuest = Partial<CreateGuest> & { id: string };
