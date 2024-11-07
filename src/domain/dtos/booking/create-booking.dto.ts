import { BookingValidator } from '.';

export class CreateBookingDto {
  private constructor(
    public readonly amount: number,
    public readonly description: string,
    public readonly name: string,
    public readonly guestsNumber: number,
    public readonly checkIn: Date,
    public readonly checkOut?: Date | undefined,
    public readonly roomNumber?: number | undefined
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateBookingDto?] {
    const {
      amount,
      description,
      name,
      guestsNumber,
      checkIn,
      checkOut,
      roomNumber,
    } = props;

    const errors = BookingValidator.create({
      amount,
      description,
      name,
      guestsNumber,
      checkIn,
      checkOut,
      roomNumber,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateBookingDto(
        +amount,
        (description as string).trim(),
        (name as string).trim().toLocaleLowerCase(),
        +guestsNumber,
        new Date(checkIn),
        checkOut !== undefined ? new Date(checkOut) : undefined,
        roomNumber !== undefined ? +roomNumber : undefined
      ),
    ];
  }
}
