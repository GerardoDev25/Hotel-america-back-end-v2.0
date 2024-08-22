import {
  BooleanValidator,
  NumberValidator,
  StringValidator,
} from '../../type-validators';
import { RoomParams, RoomType } from '../../interfaces/room.interface';
import { variables } from '../../../config';

// TODO TEST THIS TOMORROW

export class UpdateRoomDto {
  private constructor(
    public readonly roomType?: RoomType,
    public readonly roomNumber?: number,
    public readonly betsNumber?: number,
    public readonly isAvailable?: boolean
  ) {}

  private static verifyProperties(properties: Partial<Omit<RoomParams, 'id'>>) {
    const { roomType, roomNumber, betsNumber, isAvailable } = properties;

    const errors: string[] = [];

    // * roomType
    if (roomType !== undefined) {
      const roomTypeValid = StringValidator.mostBe({
        value: roomType,
        allowValues: ['suit', 'normal'],
      });
      if (roomTypeValid !== true) errors.push('roomType ' + roomTypeValid);
    }

    // * roomNumber
    if (roomNumber !== undefined) {
      const roomNumberMinValueValid = NumberValidator.isMinValue({
        value: roomNumber,
        minValue: variables.ROOM_NUMBER_MIN_VALUE,
      });
      if (roomNumberMinValueValid !== true)
        errors.push('roomNumber ' + roomNumberMinValueValid);
    }

    // * betsNumber
    if (betsNumber !== undefined) {
      const betsNumberMinValueValid = NumberValidator.isMinValue({
        value: betsNumber,
        minValue: variables.BETS_NUMBER_MIN_VALUE,
      });
      if (betsNumberMinValueValid !== true)
        errors.push('betsNumber ' + betsNumberMinValueValid);
    }

    // * isAvailable
    if (isAvailable !== undefined) {
      const isAvailableValid = BooleanValidator.isValid(isAvailable);
      if (isAvailableValid !== true)
        errors.push('isAvailable ' + isAvailableValid);
    }
    return errors;
  }

  static create(props: Record<string, any>): [string[]?, UpdateRoomDto?] {
    let { roomType, roomNumber, betsNumber, isAvailable = false } = props;

    const errors = UpdateRoomDto.verifyProperties({
      roomType,
      roomNumber,
      betsNumber,
      isAvailable,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdateRoomDto(
        roomType,
        +roomNumber,
        +betsNumber,
        !!BooleanValidator.toBoolean(isAvailable)
      ),
    ];
  }
}
