import { StringValidator } from '@domain/type-validators';

export class AuthRefreshTokenDto {
  constructor(public readonly token: string) {}

  static create(
    obj: Record<string, string>
  ): [string[]?, AuthRefreshTokenDto?] {
    const { token } = obj;

    const errors: string[] = [];

    const tokenValidated = StringValidator.isJWT(token);
    if (!tokenValidated) errors.push('token not valid');

    if (errors.length > 0) return [errors, undefined];

    return [undefined, new AuthRefreshTokenDto(token)];
  }
}
