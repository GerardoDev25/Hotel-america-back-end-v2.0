import { BooleanValidator } from '../../type-validators';
import { RoomType } from '../../interfaces/room.interface';

export class CreateRoomDto {
  private constructor(
    public readonly roomType: RoomType,
    public readonly roomNumber: number,
    public readonly betsNumber: number,
    public readonly isAvailable: boolean
  ) {}

  static create(props: Record<string, any>): CreateRoomDto {
    const { roomType, roomNumber, betsNumber, isAvailable = false } = props;

    return new CreateRoomDto(
      roomType,
      +roomNumber,
      +betsNumber,
      !!BooleanValidator.toBoolean(isAvailable)
    );
  }
}
