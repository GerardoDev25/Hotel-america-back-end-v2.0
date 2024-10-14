export interface IRoom {
  id: string;
  roomType: RoomType;
  roomNumber: number;
  betsNumber: number;
  isAvailable: boolean;
  state: RoomState;
}

export type RoomType = 'suit' | 'normal';

export enum RoomTypesList {
  SUIT = 'suit',
  NORMAL = 'normal',
}

export type RoomState =
  | 'free'
  | 'occupied'
  | 'under_maintenance'
  | 'pending_cleaning';

export enum RoomStateList {
  FREE = 'free',
  OCCUPIED = 'occupied',
  UNDER_MAINTENANCE = 'under_maintenance',
  PENDING_CLEANING = 'pending_cleaning',
}

export interface RoomPagination {
  rooms: IRoom[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}

export type RoomFilter = Partial<Omit<IRoom, 'id'>>;
export type CreateRoom = Omit<IRoom, 'id'>;
export type UpdateRoom = Partial<CreateRoom> & { id: string };
