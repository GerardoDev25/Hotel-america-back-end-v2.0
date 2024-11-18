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

export type UpdateGuest = Partial<CreateGuest> & { id: string };

export type CreateGuest = Omit<IGuest, 'id' | 'registerId' | 'checkIn'> & {
  registerId?: string;
};

export type IGuestFilterDto = Partial<
  Omit<GuestFilter, 'checkIn' | 'checkOut' | 'dateOfBirth'>
> & {
  checkIn?: Date | { gte: Date; lt: Date };
  checkOut?: Date | { gte: Date; lt: Date };
  dateOfBirth?: Date | { gte: Date; lt: Date };
  OR?: OrField[];
};

type OrField = Record<string, { contains: string; mode: 'insensitive' }>;
