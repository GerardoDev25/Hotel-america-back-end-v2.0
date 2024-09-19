import { BooleanValidator } from '@domain/type-validators';
import { RoomType } from '@domain/interfaces/room.interface';
import { RoomValidator } from './room-validator-dtos';

export class CreateRoomDto {
  private constructor(
    public readonly roomType: RoomType,
    public readonly roomNumber: number,
    public readonly betsNumber: number,
    public readonly isAvailable: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateRoomDto?] {
    const { roomType, roomNumber, betsNumber, isAvailable = false } = props;

    const errors = RoomValidator.create({
      roomType,
      roomNumber,
      betsNumber,
      isAvailable,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateRoomDto(
        roomType,
        +roomNumber,
        +betsNumber,
        !!BooleanValidator.toBoolean(isAvailable)
      ),
    ];
  }
}
