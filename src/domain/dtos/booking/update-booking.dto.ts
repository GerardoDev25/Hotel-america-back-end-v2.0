import { BookingValidator } from '.';

export class UpdateBookingDto {
  private constructor(
    public readonly id: string,
    public readonly amount?: number | undefined,
    public readonly description?: string | undefined,
    public readonly name?: string | undefined,
    public readonly guestsNumber?: number | undefined,
    public readonly checkIn?: Date | undefined,
    public readonly checkOut?: Date | undefined,
    public readonly roomNumber?: number | undefined
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdateBookingDto?] {
    const {
      id,
      amount,
      description,
      name,
      guestsNumber,
      checkIn,
      checkOut,
      roomNumber,
    } = props;

    const errors = BookingValidator.update({
      id,
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
      new UpdateBookingDto(
        (id as string).trim(),
        amount !== undefined ? +amount : undefined,
        description !== undefined ? (description as string).trim() : undefined,
        name !== undefined
          ? (name as string).trim().toLocaleLowerCase()
          : undefined,
        guestsNumber !== undefined ? +guestsNumber : undefined,
        checkIn !== undefined ? new Date(checkIn) : undefined,
        checkOut !== undefined ? new Date(checkOut) : undefined,
        roomNumber !== undefined ? +roomNumber : undefined
      ),
    ];
  }
}
