import { RoomType } from '../../interfaces';

export class CreateRoomDto {
  private constructor(
    public readonly roomType: RoomType,
    public readonly roomNumber: number,
    public readonly betsNumber: number,
    public readonly isAvailable: boolean
  ) {}

  static create(props: Record<string, any>): [string[], CreateRoomDto?] {
    let { roomType, roomNumber, betsNumber, isAvailable } = props;

    const errors: string[] = [];
    roomNumber = Number(roomNumber);
    betsNumber = Number(betsNumber);

    console.log({ roomNumber, betsNumber });

    // ? roomType
    if (!roomType || typeof roomType != 'string')
      errors.push('"roomType" property is required');
    if (roomType !== 'suit' && roomType !== 'normal')
      errors.push('"roomType" property is not valid');

    // todo fix roomNumber and betsNumber

    // ?roomNumber
    if (!roomNumber) errors.push('"roomNumber" property is required');
    if (isNaN(roomNumber)) errors.push('"roomNumber" most be a number');

    // ?betsNumber
    if (!betsNumber) errors.push('"betsNumber" property is required');
    if (isNaN(betsNumber)) errors.push('"betsNumber" most be a number');

    if (isAvailable && typeof isAvailable !== 'boolean')
      errors.push('isAvailable most be a boolean');

    if (errors.length > 0) return [errors, undefined];
    return [
      [],
      new CreateRoomDto(
        roomType,
        roomNumber,
        betsNumber === 0 ? 1 : betsNumber,
        !!isAvailable
      ),
    ];
  }
}
