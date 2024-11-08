import { Request, Response } from 'express';

import { CustomError } from '@domain/error';
import { variables } from '@domain/variables';
import {
  PaginationDto,
  CreateBookingDto,
  FilterBookingDto,
  UpdateBookingDto,
} from '@domain/dtos';
import { BookingService } from '.';

export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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

    this.bookingService
      .getAll(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getByParams = async (req: Request, res: Response) => {
    const page = req.query.page ?? variables.PAGINATION_PAGE_DEFAULT;
    const limit = req.query.limit ?? variables.PAGINATION_LIMIT_DEFAULT;

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );

    if (paginationError) {
      return res.status(400).json({ ok: false, errors: [paginationError] });
    }

    const [filterError, filterDto] = FilterBookingDto.create(req.body);
    if (filterError) {
      return res.status(400).json({ ok: false, errors: filterError });
    }

    this.bookingService
      .getByParams(paginationDto!, filterDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getById = async (req: Request, res: Response) => {
    this.bookingService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public create = async (req: Request, res: Response) => {
    const [errors, createBookingDto] = CreateBookingDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.bookingService
      .create(createBookingDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public update = async (req: Request, res: Response) => {
    const [errors, updateBookingDto] = UpdateBookingDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.bookingService
      .update(updateBookingDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public delete = async (req: Request, res: Response) => {
    this.bookingService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
