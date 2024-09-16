import { Request, Response } from 'express';
import { UserLoginDto, UserRefreshTokenDto } from '../../domain/dtos/auth';
import { CustomError } from '../../domain/error';

export class AuthController {
  constructor() {}

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

    return res.json(userLoginDto);
  };


  refreshToken = (req: Request, res: Response) => {
    const [errors, userRefreshTokenDto] = UserRefreshTokenDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    return res.json(userRefreshTokenDto);
  }
  
}
