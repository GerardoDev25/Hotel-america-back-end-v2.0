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

export type GuestFilter = Partial<Omit<IGuest, 'id'>>;
export type IGuestFilterDto = Partial<
  Omit<GuestFilter, 'checkIn' | 'checkOut' | 'dateOfBirth'>
> & {
  checkIn?: Date;
  checkOut?: Date;
  dateOfBirth?: Date;
};

export type CreateGuest = Omit<IGuest, 'id' | 'registerId' | 'checkIn'> & {
  registerId?: string;
};
export type UpdateGuest = Partial<CreateGuest> & { id: string };
