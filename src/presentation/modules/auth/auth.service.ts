import { AuthLoginDto, AuthRefreshTokenDto } from '@domain/dtos';
import { CustomError } from '@domain/error';
import { UserDatasource } from '@domain/datasources';

import { BcryptAdapter, JwtAdapter } from '@src/adapters';

export class AuthService {
  constructor(private readonly userDatasource: UserDatasource) {}

  private handleError(error: unknown) {
    if (error instanceof CustomError) throw error;
    throw CustomError.internalServerError('Internal Server Error');
  }

  login = async (userLoginDto: AuthLoginDto) => {
    const { username, password } = userLoginDto;
    const page = 1;
    const limit = 1;

    try {
      const { users } = await this.userDatasource.getByParams(page, limit, {
        username,
      });

      const [user] = users;

      // ? if user not exist
      if (!user || !user.isActive) {
        throw CustomError.badRequest('user or password not allow');
      }

      // ? if password not match
      const isMatch = BcryptAdapter.compare(password, user.password);
      if (!isMatch) throw CustomError.badRequest('user or password not allow');

      // ? generate token
      const token = await JwtAdapter.generateToken({
        payload: { id: user.id },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return { ok: true, user: userWithoutPassword, token };
    } catch (error) {
      throw this.handleError(error);
    }
  };

  refreshToken = async (userRefreshTokenDto: AuthRefreshTokenDto) => {
    const { token } = userRefreshTokenDto;

    const payload = await JwtAdapter.verifyToken<{ id: string }>(token);

    if (!payload) {
      throw CustomError.unauthorized('token invalid or expired');
    }

    try {
      const { ok, user } = await this.userDatasource.getById(payload.id);

      if (!user || !user.isActive) {
        throw CustomError.badRequest('user not allow');
      }

      const token = await JwtAdapter.generateToken({
        payload: { id: user.id },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return { ok, user: userWithoutPassword, token };
    } catch (error) {
      throw this.handleError(error);
    }
  };
}
