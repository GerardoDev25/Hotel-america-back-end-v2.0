import { variables } from '@domain/variables';
import { CustomError } from '@domain/error/';
import { IRoom, RoomState, RoomType } from '@domain/interfaces/';
import {
  BooleanValidator,
  NumberValidator,
  StringValidator,
} from '@domain/type-validators';

export class RoomEntity implements IRoom {
  static readonly allowValuesState: RoomState[] = [
    'free',
    'occupied',
    'pending_cleaning',
    'under_maintenance',
  ];
  static readonly allowValuesType: RoomType[] = ['normal', 'suit'];

  id: string;
  roomType: RoomType;
  roomNumber: number;
  betsNumber: number;
  isAvailable: boolean;
  state: RoomState;

  constructor(params: IRoom) {
    this.id = params.id;
    this.roomType = params.roomType;
    this.roomNumber = params.roomNumber;
    this.betsNumber = params.betsNumber;
    this.isAvailable = params.isAvailable;
    this.state = params.state;
  }

  private static verifyProperties(properties: IRoom) {
    const { id, roomType, roomNumber, betsNumber, isAvailable, state } =
      properties;

    // * id
    const idValidation = StringValidator.isValidUUID(id);
    if (idValidation !== true) {
      throw CustomError.badRequest('id' + idValidation);
    }

    // * state
    const stateValid = StringValidator.mostBe({
      value: state,
      allowValues: RoomEntity.allowValuesState,
    });
    if (stateValid !== true)
      throw CustomError.badRequest('state ' + stateValid);

    // * roomType
    const roomTypeValid = StringValidator.mostBe({
      value: roomType,
      allowValues: RoomEntity.allowValuesType,
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
    const { id, roomType, roomNumber, betsNumber, isAvailable, state } = object;

    RoomEntity.verifyProperties({
      id,
      roomType,
      roomNumber,
      betsNumber,
      isAvailable,
      state,
    });

    return new RoomEntity({
      id,
      roomType,
      roomNumber: +roomNumber,
      betsNumber: +betsNumber,
      isAvailable: BooleanValidator.toBoolean(isAvailable) ?? false,
      state,
    });
  }
}
