import { StringValidator } from '../../type-validators';

export class UserRefreshTokenDto {
  constructor(public readonly token: string) {}

  static create(
    obj: Record<string, string>
  ): [string[]?, UserRefreshTokenDto?] {
    const { token } = obj;

    const errors: string[] = [];

    const tokenValidated = StringValidator.isJWT(token);
    if (!tokenValidated) errors.push('token not valid');

    if (errors.length > 0) return [errors, undefined];

    return [undefined, new UserRefreshTokenDto(token)];
  }
}
