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
  users: IUser[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type UserFilter = Partial<Omit<IUser, 'id'>>;
export type IUserFilterDto = Partial<Omit<UserFilter, 'birdDate'>> & {
  birdDate?: Date;
};
export type CreateUser = Omit<IUser, 'id'>;
export type UpdateUser = Partial<CreateUser> & { id: string };
