import { BooleanValidator, DateValidator } from '@domain/type-validators';
import { UserRole } from '@domain/interfaces';
import { UserValidator } from './user-validator-dtos';

export class UpdateUserDto {
  private constructor(
    public readonly id: string,
    public readonly role?: UserRole,
    public readonly birdDate?: Date,
    public readonly name?: string,
    public readonly phone?: string,
    public readonly username?: string,
    public readonly password?: string,
    public readonly isActive?: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, UpdateUserDto?] {
    const { id, role, birdDate, name, phone, username, password, isActive } =
      props;

    const errors = UserValidator.update({
      id,
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
      new UpdateUserDto(
        id,
        role,
        DateValidator.toDate(birdDate) ?? undefined,
        name ? (name as string).trim() : undefined,
        phone ? (phone as string).trim() : undefined,
        username ? (username as string).trim().toLowerCase() : undefined,
        password ? (password as string).trim() : undefined,
        !!BooleanValidator.toBoolean(isActive)
      ),
    ];
  }
}
