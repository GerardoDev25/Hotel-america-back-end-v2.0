import { Request, Response } from 'express';
import { CreatePaymentDto, UpdatePaymentDto } from '@domain/dtos/payment';
import { CustomError } from '@domain/error';
import { PaginationDto } from '@domain/dtos/share';
import { variables } from '@domain/variables';
import { PaymentService } from '.';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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

    return this.paymentService
      .getAll(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getById = async (req: Request, res: Response) => {
    this.paymentService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public create = async (req: Request, res: Response) => {
    const [errors, createPaymentDto] = CreatePaymentDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.paymentService
      .create(createPaymentDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public update = async (req: Request, res: Response) => {
    const [errors, updatePaymentDto] = UpdatePaymentDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.paymentService
      .update(updatePaymentDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public delete = async (req: Request, res: Response) => {
    this.paymentService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
