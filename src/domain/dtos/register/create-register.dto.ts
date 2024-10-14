import { RegisterValidator } from './register-validator-dtos';

export class CreateRegisterDto {
  private constructor(
    public readonly discount: number,
    public readonly price: number,
    public readonly userId: string,
    public readonly roomId: string,
    public readonly checkOut?: Date,
    public readonly guestsNumber?: number
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateRegisterDto?] {
    const { guestsNumber, discount, price, userId, roomId, checkOut } = props;

    const errors = RegisterValidator.create({
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
      new CreateRegisterDto(
        +discount,
        +price,
        (userId as string).trim(),
        (roomId as string).trim(),
        checkOut ? new Date(checkOut) : undefined,
        guestsNumber ? +guestsNumber : undefined
      ),
    ];
  }
}
