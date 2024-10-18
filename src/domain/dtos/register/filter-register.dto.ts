import { IRegisterFilterDto } from '@src/domain/interfaces';
import { RegisterValidator } from './register-validator-dtos';

export class FilterRegisterDto implements IRegisterFilterDto {
  private constructor(
    public readonly guestsNumber?: number,
    public readonly discount?: number,
    public readonly price?: number,
    public readonly userId?: string,
    public readonly roomId?: string,
    public readonly checkOut?: Date,
    public readonly checkIn?: Date
  ) {}

  static create(props: Record<string, any>): [string[]?, FilterRegisterDto?] {
    const { guestsNumber, discount, price, userId, roomId, checkOut, checkIn } =
      props;

    const errors = RegisterValidator.filter({
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
      checkOut,
      checkIn,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new FilterRegisterDto(
        guestsNumber !== undefined ? +guestsNumber : undefined,
        discount !== undefined ? +discount : undefined,
        price !== undefined ? +price : undefined,
        userId !== undefined ? (userId as string).trim() : undefined,
        roomId !== undefined ? (roomId as string).trim() : undefined,
        checkOut !== undefined ? new Date(checkOut) : undefined,
        checkIn !== undefined ? new Date(checkIn) : undefined
      ),
    ];
  }
}
