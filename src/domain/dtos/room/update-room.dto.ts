import { BooleanValidator } from '@domain/type-validators';
import { RoomType } from '@domain/interfaces/';
import { RoomValidator } from './room-validator-dtos';
import { RoomState } from '@prisma/client';

export class UpdateRoomDto {
  private constructor(
    public readonly id: string,
    public readonly roomType?: RoomType,
    public readonly state?: RoomState,
    public readonly roomNumber?: number,
    public readonly betsNumber?: number,
    public readonly isAvailable?: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdateRoomDto?] {
    const {
      id,
      roomType,
      state,
      roomNumber,
      betsNumber,
      isAvailable = false,
    } = props;

    const errors = RoomValidator.update({
      id,
      roomType,
      state,
      roomNumber,
      betsNumber,
      isAvailable,
    });

    if (errors.length) return [errors, undefined];
    return [
      undefined,
      new UpdateRoomDto(
        (id as string).trim(),
        roomType ? roomType : undefined,
        state ? state : undefined,
        roomNumber ? +roomNumber : undefined,
        betsNumber ? +betsNumber : undefined,
        !!BooleanValidator.toBoolean(isAvailable)
      ),
    ];
  }
}
