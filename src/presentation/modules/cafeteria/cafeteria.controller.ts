import { Request, Response } from 'express';
import { CustomError } from '@domain/error';
import { UpdateCafeteriaDto } from '@domain/dtos';
import { CafeteriaService } from '.';

export class CafeteriaController {
  constructor(private readonly cafeteriaService: CafeteriaService) {}

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

  public getAll = async (req: Request, res: Response) => {
    return this.cafeteriaService
      .getAll()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public update = async (req: Request, res: Response) => {
    const [errors, updateCafeteriaDto] = UpdateCafeteriaDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.cafeteriaService
      .update(updateCafeteriaDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
