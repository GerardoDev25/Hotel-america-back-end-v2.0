import { RegisterValidator } from './register-validator-dtos';

export class CreateRegisterDto {
  constructor(
    public readonly guestsNumber: number,
    public readonly discount: number,
    public readonly price: number,
    public readonly userId: string,
    public readonly roomId: string,
    public readonly checkIn: Date,
    public readonly checkOut?: Date
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateRegisterDto?] {
    const { guestsNumber, discount, price, userId, roomId, checkIn, checkOut } =
      props;

    const errors = RegisterValidator.create({
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
      checkIn,
      checkOut,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateRegisterDto(
        +guestsNumber,
        +discount,
        +price,
        userId,
        roomId,
        new Date(checkIn),
        checkOut ? new Date(checkOut) : undefined
      ),
    ];
  }
}
