import { RoomParams, RoomType } from '../interfaces';

export class RoomEntity implements RoomParams {
  id: string;
  roomType: RoomType;
  roomNumber: number;
  betsNumber: number;
  isAvailable: boolean;

  constructor(params: RoomParams) {
    this.id = params.id;
    this.roomType = params.roomType;
    this.roomNumber = params.roomNumber;
    this.betsNumber = params.betsNumber;
    this.isAvailable = params.isAvailable;
  }

  static fromObject(object: Record<string, any>): RoomEntity {
    const { id, roomType, roomNumber, betsNumber, isAvailable } = object;

    if (!id) throw new Error('Id is required');
    if (typeof id !== 'string') throw new Error('Id not valid');

    if (!roomType || typeof roomType != 'string')
      throw new Error('"roomType" property is required');
    if (roomType !== 'suit' && roomType !== 'normal')
      throw new Error('"roomType" property is not valid');

    if (!roomNumber) throw new Error('"roomNumber" property is required');
    if (isNaN(roomNumber)) throw new Error('"roomNumber" most be a number');

    if (!betsNumber) throw new Error('betsNumber is required');
    if (!betsNumber || isNaN(betsNumber))
      throw new Error('betsNumber most be a number');

    return new RoomEntity({
      id,
      roomType,
      roomNumber,
      betsNumber,
      isAvailable,
    });
  }
}
