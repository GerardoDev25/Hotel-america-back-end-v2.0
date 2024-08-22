export interface RoomParams {
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
