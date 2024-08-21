import {
  BooleanValidator,
  NumberValidator,
  StringValidator,
} from '../../type-validators';
import { RoomType } from '../../interfaces/room.interface';

export class CreateRoomDto {
  private constructor(
    public readonly roomType: RoomType,
    public readonly roomNumber: number,
    public readonly betsNumber: number,
    public readonly isAvailable: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateRoomDto?] {
    let { roomType, roomNumber, betsNumber, isAvailable = false } = props;

    const errors: string[] = [];

    // * roomType
    const roomTypeValid = StringValidator.mostBe({
      value: roomType,
      allowValues: ['suit', 'normal'],
    });
    if (roomTypeValid !== true) errors.push('roomType ' + roomTypeValid);

    // * roomNumber
    const roomNumberMinValueValid = NumberValidator.isMinValue({
      value: roomNumber,
      minValue: 1,
    });
    if (roomNumberMinValueValid !== true)
      errors.push('roomNumber ' + roomNumberMinValueValid);

    // * betsNumber
    const betsNumberMinValueValid = NumberValidator.isMinValue({
      value: betsNumber,
      minValue: 1,
    });
    if (betsNumberMinValueValid !== true)
      errors.push('betsNumber ' + betsNumberMinValueValid);

    // * isAvailable
    const isAvailableValid = BooleanValidator.isValid({
      value: isAvailable,
      isRequired: true,
    });
    if (isAvailableValid !== true)
      errors.push('isAvailable ' + isAvailableValid);

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
