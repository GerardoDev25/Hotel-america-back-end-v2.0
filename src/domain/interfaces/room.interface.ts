export interface IRoom {
  id: string;
  roomType: RoomType;
  roomNumber: number;
  betsNumber: number;
  isAvailable: boolean;
  state: RoomState;
}

export type RoomType = 'suit' | 'normal';

export type RoomState =
  | 'free'
  | 'occupied'
  | 'under_maintenance'
  | 'pending_cleaning';

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
