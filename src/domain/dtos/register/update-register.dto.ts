import { RegisterValidator } from './register-validator-dtos';

export class UpdateRegisterDto {
  private constructor(
    public readonly id: string,
    public readonly guestsNumber?: number,
    public readonly discount?: number,
    public readonly price?: number,
    public readonly userId?: string,
    public readonly roomId?: string,
    public readonly checkOut?: Date
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdateRegisterDto?] {
    const { id, guestsNumber, discount, price, userId, roomId, checkOut } =
      props;

    const errors = RegisterValidator.update({
      id,
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
      checkOut,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdateRegisterDto(
        (id as string).trim(),
        guestsNumber ? +guestsNumber : undefined,
        discount || discount === 0 ? +discount : undefined,
        price ? +price : undefined,
        userId ? (userId as string).trim() : undefined,
        roomId ? (roomId as string).trim() : undefined,
        checkOut ? new Date(checkOut) : undefined
      ),
    ];
  }
}
