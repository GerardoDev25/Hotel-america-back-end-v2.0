import { IGuestFilterDto } from '@src/domain/interfaces';
import { GuestValidator } from './guest-validator.dto';

export class FilterGuestDto implements IGuestFilterDto {
  private constructor(
    public readonly di?: string,
    public readonly city?: string,
    public readonly name?: string,
    public readonly lastName?: string,
    public readonly phone?: string,
    public readonly roomNumber?: number,
    public readonly countryId?: string,
    public readonly registerId?: string,
    public readonly dateOfBirth?: Date,
    public readonly checkIn?: Date,
    public readonly checkOut?: Date
  ) {}

  static create(props: Record<string, any>): [string[]?, FilterGuestDto?] {
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

    const errors = GuestValidator.filter({
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
      new FilterGuestDto(
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
        checkIn !== undefined ? new Date(checkIn) : undefined,
        checkOut !== undefined ? new Date(checkOut) : undefined
      ),
    ];
  }
}
