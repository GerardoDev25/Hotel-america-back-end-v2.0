import { BcryptAdapter, JwtAdapter } from '../../../adapters';
import { AuthLoginDto, AuthRefreshTokenDto } from '../../../domain/dtos/auth';
import { CustomError } from '../../../domain/error';
import { UserRepository } from '../../../domain/repositories/user.repository';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  private handleError(error: unknown) {
    if (error instanceof CustomError) throw error;
    throw CustomError.internalServerError('Internal Server Error');
  }

  login = async (userLoginDto: AuthLoginDto) => {
    const { username, password } = userLoginDto;

    try {
      const { ok, user } = await this.userRepository.getByParam({ username });

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

      const { password: _, ...userWithoutPassword } = user;

      return { ok, user: userWithoutPassword, token };
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
      const { ok, user } = await this.userRepository.getById(payload.id);

      if (!user || !user.isActive) {
        throw CustomError.badRequest('user not allow');
      }

      const token = await JwtAdapter.generateToken({
        payload: { id: user.id },
      });
      const { password: _, ...userWithoutPassword } = user;

      return { ok, user: userWithoutPassword, token };
    } catch (error) {
      throw this.handleError(error);
    }
  };
}
