import { BooleanValidator } from '@domain/type-validators';
import { RoomType } from '@domain/interfaces/';
import { RoomValidator } from './room-validator-dtos';
import { RoomState } from '@prisma/client';

export class FilterRoomDto {
  private constructor(
    public readonly roomType?: RoomType,
    public readonly state?: RoomState,
    public readonly roomNumber?: number,
    public readonly betsNumber?: number,
    public readonly isAvailable?: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, FilterRoomDto?] {
    const {
      roomType,
      state,
      roomNumber,
      betsNumber,
      isAvailable = false,
    } = props;

    const errors = RoomValidator.filter({
      roomType,
      state,
      roomNumber,
      betsNumber,
      isAvailable,
    });

    if (errors.length) return [errors, undefined];
    return [
      undefined,
      new FilterRoomDto(
        roomType ? roomType : undefined,
        state ? state : undefined,
        roomNumber ? +roomNumber : undefined,
        betsNumber ? +betsNumber : undefined,
        !!BooleanValidator.toBoolean(isAvailable)
      ),
    ];
  }
}
