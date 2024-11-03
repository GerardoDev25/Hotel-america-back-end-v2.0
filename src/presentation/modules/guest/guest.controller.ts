import { Response, Request } from 'express';

import {
  PaginationDto,
  CreateGuestDto,
  FilterGuestDto,
  UpdateGuestDto,
} from '@domain/dtos';
import { CustomError } from '@domain/error';
import { variables } from '@domain/variables';
import { GuestService } from '.';
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

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

    this.guestService
      .getAll(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  getByParams = async (req: Request, res: Response) => {
    const page = req.query.page ?? variables.PAGINATION_PAGE_DEFAULT;
    const limit = req.query.limit ?? variables.PAGINATION_LIMIT_DEFAULT;

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );

    if (paginationError) {
      return res.status(400).json({ ok: false, errors: [paginationError] });
    }

    const [filterError, filterDto] = FilterGuestDto.create(req.body);
    if (filterError) {
      return res.status(400).json({ ok: false, errors: filterError });
    }

    return this.guestService
      .getByParams(paginationDto!, filterDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getById = async (req: Request, res: Response) => {
    this.guestService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public create = async (req: Request, res: Response) => {
    const [errors, createGuestDto] = CreateGuestDto.create(req.body);

    if (!createGuestDto?.registerId) {
      errors?.push('registerId property is required');
    }

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.guestService
      .create(createGuestDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public update = async (req: Request, res: Response) => {
    const [errors, updateGuestDto] = UpdateGuestDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.guestService
      .update(updateGuestDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public delete = async (req: Request, res: Response) => {
    this.guestService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
