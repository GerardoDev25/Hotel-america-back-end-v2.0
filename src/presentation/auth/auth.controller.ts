import { Request, Response } from 'express';
import { UserLoginDto, UserRefreshTokenDto } from '../../domain/dtos/auth';
import { CustomError } from '../../domain/error';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res
        .status(error.statusCode)
        .json({ ok: false, errors: [error.message] });
    }
    return res
      .status(500)
      .json({ ok: false, errors: [`Internal server error - check Logs`] });
  };

  login = (req: Request, res: Response) => {
    const [errors, userLoginDto] = UserLoginDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    return this.authService
      .login(userLoginDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  refreshToken = (req: Request, res: Response) => {
    const [errors, userRefreshTokenDto] = UserRefreshTokenDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }
    return this.authService
      .refreshToken(userRefreshTokenDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };
}
