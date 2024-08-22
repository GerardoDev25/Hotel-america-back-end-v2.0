import { variables } from '../../config';
import { CustomError } from '../error/error.custom';
import { RoomParams, RoomType } from '../interfaces';
import {
  BooleanValidator,
  NumberValidator,
  StringValidator,
} from '../type-validators';

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

  private static verifyProperties(properties: RoomParams) {
    const { id, roomType, roomNumber, betsNumber, isAvailable } = properties;

    // * id
    const idValidation = StringValidator.isValid(id);
    if (idValidation !== true) {
      throw CustomError.badRequest('id' + idValidation);
    }

    // * roomType
    const roomTypeValid = StringValidator.mostBe({
      value: roomType,
      allowValues: ['suit', 'normal'],
    });
    if (roomTypeValid !== true)
      throw CustomError.badRequest('roomType ' + roomTypeValid);

    // * roomNumber
    const roomNumberMinValueValid = NumberValidator.isMinValue({
      value: roomNumber,
      minValue: variables.ROOM_NUMBER_MIN_VALUE,
    });
    if (roomNumberMinValueValid !== true)
      throw CustomError.badRequest('roomNumber ' + roomNumberMinValueValid);

    // * betsNumber
    const betsNumberMinValueValid = NumberValidator.isMinValue({
      value: betsNumber,
      minValue: variables.BETS_NUMBER_MIN_VALUE,
    });
    if (betsNumberMinValueValid !== true)
      throw CustomError.badRequest('betsNumber ' + betsNumberMinValueValid);

    // * isAvailable
    const isAvailableValid = BooleanValidator.isValid(isAvailable);
    if (isAvailableValid !== true)
      throw CustomError.badRequest('isAvailable ' + isAvailableValid);
  }

  static fromObject(object: Record<string, any>): RoomEntity {
    const { id, roomType, roomNumber, betsNumber, isAvailable } = object;

    RoomEntity.verifyProperties({
      id,
      roomType,
      roomNumber,
      betsNumber,
      isAvailable,
    });

    return new RoomEntity({
      id,
      roomType,
      roomNumber: +roomNumber,
      betsNumber: +betsNumber,
      isAvailable: BooleanValidator.toBoolean(isAvailable) ?? false,
    });
  }
}
