import { GuestValidator } from './guest-validator';

export class CreateGuestDto {
  private constructor(
    public readonly di: string,
    public readonly city: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly roomNumber: number,
    public readonly countryId: string,
    public readonly registerId: string,
    public readonly dateOfBirth: Date,
    public readonly checkIn: Date,
    public readonly checkOut?: Date
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateGuestDto?] {
    const {
      di,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
      dateOfBirth,
      checkIn,
      checkOut,
    } = props;

    const errors = GuestValidator.create({
      di,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
      dateOfBirth,
      checkIn,
      checkOut,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateGuestDto(
        di,
        city,
        name,
        lastName,
        phone,
        +roomNumber,
        countryId,
        registerId,
        new Date(dateOfBirth),
        new Date(checkIn),
        checkOut ? new Date(checkOut) : undefined
      ),
    ];
  }
}
