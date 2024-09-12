import { BooleanValidator, DateValidator } from '../../type-validators';
import { UserRole } from '../../interfaces';
import { UserValidator } from './user-validator-dtos';

export class CreateUserDto {
  private constructor(
    public readonly role: UserRole,
    public readonly birdDate: Date,
    public readonly name: string,
    public readonly phone: string,
    public readonly username: string,
    public readonly password: string,
    public readonly isActive: boolean
  ) {}

  static create(props: Record<string, any>): [string[]?, CreateUserDto?] {
    const {
      role,
      birdDate,
      name,
      phone,
      username,
      password,
      isActive = false,
    } = props;

    const errors = UserValidator.create({
      role,
      birdDate,
      name,
      phone,
      username,
      password,
      isActive,
    });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new CreateUserDto(
        role,
        DateValidator.toDate(birdDate) ?? new Date(),
        name,
        phone,
        username,
        password,
        !!BooleanValidator.toBoolean(isActive)
      ),
    ];
  }
}
