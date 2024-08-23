import {
  BooleanValidator,
  NumberValidator,
  StringValidator,
} from '../../type-validators';
import { RoomParams, RoomType, RoomTypesList } from '../../interfaces/';
import { variables } from '../../../config';

type UpdateRoomDtoProps = {
  id: string;
} & Partial<Omit<RoomParams, 'id'>>;

export class UpdateRoomDto {
  private constructor(
    public readonly id: string,
    public readonly roomType?: RoomType,
    public readonly roomNumber?: number,
    public readonly betsNumber?: number,
    public readonly isAvailable?: boolean
  ) {}

  // private static verifyProperties(properties: UpdateRoomDtoProps) {
  // const { id, roomType, roomNumber, betsNumber, isAvailable } = properties;

  // const errors: string[] = [];

  // // * id
  // const idValid = StringValidator.isValid(id);
  // if (idValid !== true) errors.push('id ' + idValid);

  // // * roomType
  // if (roomType !== undefined) {
  //   const roomTypeValid = StringValidator.mostBe({
  //     value: roomType,
  //     allowValues: [RoomTypesList.SUIT, RoomTypesList.NORMAL],
  //   });
  //   if (roomTypeValid !== true) errors.push('roomType ' + roomTypeValid);
  // }

  // // * roomNumber
  // if (roomNumber !== undefined) {
  //   const roomNumberMinValueValid = NumberValidator.isMinValue({
  //     value: roomNumber,
  //     minValue: variables.ROOM_NUMBER_MIN_VALUE,
  //   });
  //   if (roomNumberMinValueValid !== true)
  //     errors.push('roomNumber ' + roomNumberMinValueValid);
  // }

  // // * betsNumber
  // if (betsNumber !== undefined) {
  //   const betsNumberMinValueValid = NumberValidator.isMinValue({
  //     value: betsNumber,
  //     minValue: variables.BETS_NUMBER_MIN_VALUE,
  //   });
  //   if (betsNumberMinValueValid !== true)
  //     errors.push('betsNumber ' + betsNumberMinValueValid);
  // }

  // // * isAvailable
  // if (isAvailable !== undefined) {
  //   const isAvailableValid = BooleanValidator.isValid(isAvailable);
  //   if (isAvailableValid !== true)
  //     errors.push('isAvailable ' + isAvailableValid);
  // }
  // return errors;
  // }

  // static create(props: Record<string, any>): [string[]?, UpdateRoomDto?] {
  //   let { id, roomType, roomNumber, betsNumber, isAvailable = false } = props;

  //   const errors = UpdateRoomDto.verifyProperties({
  //     id,
  //     roomType,
  //     roomNumber,
  //     betsNumber,
  //     isAvailable,
  //   });

  //   if (errors.length > 0) return [errors, undefined];

  //   return [
  //     undefined,
  //     new UpdateRoomDto(
  //       id,
  //       roomType,
  //       +roomNumber,
  //       +betsNumber,
  //       !!BooleanValidator.toBoolean(isAvailable)
  //     ),
  //   ];
  // }
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
