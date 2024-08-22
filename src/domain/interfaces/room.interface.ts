export interface RoomParams {
  id: string;
  roomType: RoomType;
  roomNumber: number;
  betsNumber: number;
  isAvailable: boolean;
}
  export enum RoomTypesList {
    SUIT = 'suit',
    NORMAL = 'normal',
  }
  
  export type RoomType = 'suit' | 'normal';
