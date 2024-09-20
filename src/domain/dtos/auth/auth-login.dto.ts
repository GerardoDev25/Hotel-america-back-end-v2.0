import { StringValidator } from '@domain/type-validators';

interface Params {
  username: string;
  password: string;
}

export class AuthLoginDto {
  constructor(
    public username: string,
    public password: string
  ) {}

  private static verifyFields = ({ username, password }: Params): string[] => {
    const errors: string[] = [];

    // * username
    const usernameValidated = StringValidator.isValid(username);
    if (usernameValidated !== true)
      errors.push('username ' + usernameValidated);

    // * password
    const passwordValidated = StringValidator.isValid(password);
    if (passwordValidated !== true)
      errors.push('password ' + passwordValidated);

    return errors;
  };

  static create(object: Record<string, string>): [string[]?, AuthLoginDto?] {
    const { username, password } = object;

    const errors = this.verifyFields({ username, password });

    if (errors.length > 0) return [errors, undefined];

    return [
      undefined,
      new AuthLoginDto(username.trim().toLowerCase(), password.trim()),
    ];
  }
}
