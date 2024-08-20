export type RoomType = 'suit' | 'normal';

export interface RoomParams {
  id: string;
  roomType: RoomType;
  roomNumber: number;
  betsNumber: number;
  isAvailable: boolean;
}
