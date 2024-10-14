import { GuestValidator } from './guest-validator.dto';

export class UpdateGuestDto {
  private constructor(
    public readonly id: string,
    public readonly di?: string,
    public readonly city?: string,
    public readonly name?: string,
    public readonly lastName?: string,
    public readonly phone?: string,
    public readonly roomNumber?: number,
    public readonly countryId?: string,
    public readonly registerId?: string,
    public readonly dateOfBirth?: Date,
    public readonly checkOut?: Date
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdateGuestDto?] {
    const {
      id,
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

    const errors = GuestValidator.update({
      id,
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
      new UpdateGuestDto(
        (id as string).trim(),
        di ? (di as string).trim() : undefined,
        city ? (city as string).trim().toLowerCase() : undefined,
        name ? (name as string).trim().toLowerCase() : undefined,
        lastName ? (lastName as string).trim().toLowerCase() : undefined,
        phone,
        +roomNumber,
        countryId ? (countryId as string).trim() : undefined,
        registerId ? (registerId as string).trim() : undefined,
        dateOfBirth ? new Date(dateOfBirth) : undefined,
        checkOut ? new Date(checkOut) : undefined
      ),
    ];
  }
}
