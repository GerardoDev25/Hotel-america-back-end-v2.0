import { IGuestFilterDto } from '@src/domain/interfaces';
import { GuestValidator } from './guest-validator.dto';

export class UpdateGuestDto implements IGuestFilterDto {
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
        di !== undefined ? (di as string).trim() : undefined,
        city !== undefined ? (city as string).trim().toLowerCase() : undefined,
        name !== undefined ? (name as string).trim().toLowerCase() : undefined,
        lastName !== undefined
          ? (lastName as string).trim().toLowerCase()
          : undefined,
        phone !== undefined ? (phone as string).trim() : undefined,
        roomNumber !== undefined ? +roomNumber : undefined,
        countryId !== undefined ? (countryId as string).trim() : undefined,
        registerId !== undefined ? (registerId as string).trim() : undefined,
        dateOfBirth !== undefined ? new Date(dateOfBirth) : undefined,
        checkOut !== undefined ? new Date(checkOut) : undefined
      ),
    ];
  }
}
