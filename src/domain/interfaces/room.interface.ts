export interface IRoom {
  id: string;
  roomType: RoomType;
  roomNumber: number;
  betsNumber: number;
  isAvailable: boolean;
}

export type RoomType = 'suit' | 'normal';

export enum RoomTypesList {
  SUIT = 'suit',
  NORMAL = 'normal',
}

export interface RoomPagination {
  rooms: IRoom[];
  total: number;
  page: number;
  limit: number;
  prev: string | null;
  next: string | null;
}
