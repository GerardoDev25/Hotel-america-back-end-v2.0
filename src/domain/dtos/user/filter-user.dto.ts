import { BooleanValidator, DateValidator } from '@domain/type-validators';
import { IUserFilterDto, UserRole } from '@domain/interfaces';
import { UserValidator } from './user-validator-dtos';

export class FilterUserDto implements IUserFilterDto {
  private constructor(
    public readonly role?: UserRole,
    public readonly birdDate?: Date,
    public readonly name?: string,
    public readonly phone?: string,
    public readonly username?: string,
    public readonly password?: string,
    public readonly isActive?: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, FilterUserDto?] {
    const { role, birdDate, name, phone, username, password, isActive } = props;

    const errors = UserValidator.filter({
      role,
      birdDate,
      name,
      phone,
      username,
      password,
      isActive,
    });

    if (errors.length > 0) {
      return [errors, undefined];
    }

    return [
      undefined,
      new FilterUserDto(
        role ? role : undefined,
        DateValidator.toDate(birdDate) ?? undefined,
        name ? (name as string).trim() : undefined,
        phone ? (phone as string).trim() : undefined,
        username ? (username as string).trim().toLowerCase() : undefined,
        password ? (password as string).trim() : undefined,
        isActive !== undefined
          ? !!BooleanValidator.toBoolean(isActive)
          : undefined
      ),
    ];
  }
}
