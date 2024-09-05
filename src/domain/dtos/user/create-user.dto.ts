import { BooleanValidator, DateValidator } from '../../type-validators';
import { UserRole } from '../../interfaces';

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

  static create(props: Record<string, any>): CreateUserDto {
    const {
      role,
      birdDate,
      name,
      phone,
      username,
      password,
      isActive = false,
    } = props;

    return new CreateUserDto(
      role,
      DateValidator.toDate(birdDate) ?? new Date(),
      name,
      phone,
      username,
      password,
      !!BooleanValidator.toBoolean(isActive)
    );
  }
}
