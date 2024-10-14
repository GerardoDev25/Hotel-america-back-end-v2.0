import { GuestValidator } from './guest-validator.dto';

export class CreateGuestDto {
  private constructor(
    public readonly di: string,
    public readonly city: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly roomNumber: number,
    public readonly countryId: string,
    public readonly dateOfBirth: Date,
    public readonly checkOut?: Date,
    public readonly registerId?: string
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
      checkOut,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateGuestDto(
        (di as string).trim(),
        (city as string).trim().toLowerCase(),
        (name as string).trim().toLowerCase(),
        (lastName as string).trim().toLowerCase(),
        (phone as string).trim(),
        +roomNumber,
        (countryId as string).trim(),
        new Date(dateOfBirth),
        checkOut ? new Date(checkOut) : undefined,
        registerId ? (registerId as string).trim() : undefined
      ),
    ];
  }
}
