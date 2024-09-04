export interface IUser {
  id: string;
  role: UserRole;
  birdDate: string;
  name: string;
  phone: string;
  username: string;
  password: string;
  isActive: boolean;
}

export type UserRole = 'admin' | 'laundry' | 'reception' | 'cafe';

export enum UserRolesList {
  ADMIN = 'admin',
  LAUNDRY = 'laundry',
  RECEPTION = 'reception',
  CAFE = 'cafe',
}

export interface UserPagination {
  rooms: IUser[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}
