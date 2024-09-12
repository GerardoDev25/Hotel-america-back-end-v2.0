import { BooleanValidator, DateValidator } from '../../type-validators';
import { UserRole } from '../../interfaces';
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
    let { id, role, birdDate, name, phone, username, password, isActive } =
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
        name,
        phone,
        username,
        password,
        !!BooleanValidator.toBoolean(isActive)
      ),
    ];
  }
}
