import { BooleanValidator } from '../../type-validators';
import { RoomParams, RoomType } from '../../interfaces/';

export class UpdateRoomDto {
  private constructor(
    public readonly id: string,
    public readonly roomType?: RoomType,
    public readonly roomNumber?: number,
    public readonly betsNumber?: number,
    public readonly isAvailable?: boolean
  ) {}

  static create(props: Record<string, any>): UpdateRoomDto {
    let { id, roomType, roomNumber, betsNumber, isAvailable = false } = props;

    return new UpdateRoomDto(
      id,
      roomType,
      +roomNumber,
      +betsNumber,
      !!BooleanValidator.toBoolean(isAvailable)
    );
  }
}
