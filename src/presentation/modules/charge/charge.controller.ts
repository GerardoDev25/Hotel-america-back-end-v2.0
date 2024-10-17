import { Request, Response } from 'express';
import {
  CreateChargeDto,
  FilterChargeDto,
  UpdateChargeDto,
} from '@domain/dtos/charge';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { variables } from '@domain/variables';
import { ChargeService } from '.';

export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

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
    const page = req.query.page ?? variables.PAGINATION_PAGE_DEFAULT;
    const limit = req.query.limit ?? variables.PAGINATION_LIMIT_DEFAULT;

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );

    if (paginationError) {
      return res.status(400).json({ ok: false, errors: [paginationError] });
    }

    return this.chargeService
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

    const [filterError, filterDto] = FilterChargeDto.create(req.body);
    if (filterError) {
      return res.status(400).json({ ok: false, errors: filterError });
    }

    return this.chargeService
      .getByParams(paginationDto!, filterDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getById = async (req: Request, res: Response) => {
    this.chargeService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public create = async (req: Request, res: Response) => {
    const [errors, createChargeDto] = CreateChargeDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.chargeService
      .create(createChargeDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public update = async (req: Request, res: Response) => {
    const [errors, updateChargeDto] = UpdateChargeDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.chargeService
      .update(updateChargeDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public delete = async (req: Request, res: Response) => {
    this.chargeService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
