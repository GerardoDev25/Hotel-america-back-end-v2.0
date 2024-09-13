import {
  BooleanValidator,
  DateValidator,
  NumberValidator,
  StringValidator,
} from '../../type-validators';
import { variables } from '../../variables';
import {
  UpdateRoom,
  CreateRoom,
  RoomTypesList,
} from '../../interfaces/room.interface';

export class RoomValidator {
  static create(object: CreateRoom): string[] {
    const errors: string[] = [];
    const { betsNumber, isAvailable = false, roomNumber, roomType } = object;

    // * betsNumber
    const betsNumberMinValueValid = NumberValidator.isMinValue({
      value: betsNumber,
      minValue: variables.BETS_NUMBER_MIN_VALUE,
    });
    if (betsNumberMinValueValid !== true) {
      errors.push(`betsNumber ${betsNumberMinValueValid}`);
    }

    // * roomNumber
    const roomNumberMinValueValid = NumberValidator.isMinValue({
      value: roomNumber,
      minValue: variables.ROOM_NUMBER_MIN_VALUE,
    });
    if (roomNumberMinValueValid !== true) {
      errors.push(`roomNumber ${roomNumberMinValueValid}`);
    }

    // * isAvailable
    const isAvailableValid = BooleanValidator.isValid(isAvailable);
    if (isAvailableValid !== true)
      errors.push('isAvailable ' + isAvailableValid);

    // * roomType
    const roomTypeValid = StringValidator.mostBe({
      value: roomType,
      allowValues: [RoomTypesList.SUIT, RoomTypesList.NORMAL],
    });
    if (roomTypeValid !== true) errors.push('roomType ' + roomTypeValid);

    return errors;
  }

  static update(object: UpdateRoom): string[] {
    const { id, roomType, roomNumber, betsNumber, isAvailable } = object;

    const errors: string[] = [];

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) errors.push('id ' + idValid);

    // * roomType
    if (roomType !== undefined) {
      const roomTypeValid = StringValidator.mostBe({
        value: roomType,
        allowValues: [RoomTypesList.SUIT, RoomTypesList.NORMAL],
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
}
