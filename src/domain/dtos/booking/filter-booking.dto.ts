import { BookingValidator } from '.';

export class FilterBookingDto {
  private constructor(
    public readonly amount?: number | undefined,
    public readonly name?: string | undefined,
    public readonly guestsNumber?: number | undefined,
    public readonly roomNumber?: number | undefined,
    public readonly checkIn?: Date | undefined,
    public readonly checkOut?: Date | undefined,
    public readonly createdAt?: Date | undefined
  ) {}

  static create(props: Record<string, any>): [string[]?, FilterBookingDto?] {
    const {
      amount,
      name,
      guestsNumber,
      roomNumber,
      checkIn,
      checkOut,
      createdAt,
    } = props;

    const errors = BookingValidator.filter({
      amount,
      name,
      guestsNumber,
      roomNumber,
      checkIn,
      checkOut,
      createdAt,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new FilterBookingDto(
        amount !== undefined ? +amount : undefined,
        name !== undefined
          ? (name as string).trim().toLocaleLowerCase()
          : undefined,
        guestsNumber !== undefined ? +guestsNumber : undefined,
        roomNumber !== undefined ? +roomNumber : undefined,
        checkIn !== undefined ? new Date(checkIn) : undefined,
        checkOut !== undefined ? new Date(checkOut) : undefined,
        createdAt !== undefined ? new Date(createdAt) : undefined
      ),
    ];
  }
}
