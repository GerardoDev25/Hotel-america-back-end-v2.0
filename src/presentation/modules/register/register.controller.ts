import { Response, Request } from 'express';
import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { variables } from '@domain/variables';
import { RegisterService } from './register.service';

export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

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
    const page = req.query.page ?? variables.PAGINATION_PAGE_DEFAULT;
    const limit = req.query.limit ?? variables.PAGINATION_LIMIT_DEFAULT;

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );

    if (paginationError) {
      return res.status(400).json({ ok: false, errors: [paginationError] });
    }

    this.registerService
      .getAll(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getById = async (req: Request, res: Response) => {
    this.registerService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public create = async (req: Request, res: Response) => {
    const [errors, createRegisterDto] = CreateRegisterDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.registerService
      .create(createRegisterDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public update = async (req: Request, res: Response) => {
    const [errors, updateRegisterDto] = UpdateRegisterDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.registerService
      .update(updateRegisterDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public deleted = async (req: Request, res: Response) => {
    this.registerService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
