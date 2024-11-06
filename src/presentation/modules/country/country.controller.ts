import { Request, Response } from 'express';
import { CustomError } from '@domain/error';
import { CountryService } from '.';

export class CountryController {
  constructor(private readonly countryService: CountryService) {}

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

  getAll = async (req: Request, res: Response) => {
    return this.countryService
      .getAll()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
