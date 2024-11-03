import { Request, Response } from 'express';

import { CustomError } from '@domain/error';
import { variables } from '@domain/variables';
import {
  ActiveDto,
  PaginationDto,
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
} from '@domain/dtos';
import { UserService } from '.';

export class UserController {
  constructor(private readonly userService: UserService) {}

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
    const active = req.query.isActive as string;

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );
    const [isActiveError, activeDto] = ActiveDto.create(active);

    if (paginationError) {
      return res.status(400).json({ ok: false, errors: [paginationError] });
    }
    if (isActiveError) {
      return res.status(400).json({ ok: false, errors: [isActiveError] });
    }

    this.userService
      .getAll(paginationDto!, activeDto!.isActive)
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

    const [filterError, filterDto] = FilterUserDto.create(req.body);
    if (filterError) {
      return res.status(400).json({ ok: false, errors: filterError });
    }

    this.userService
      .getByParams(paginationDto!, filterDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getById = async (req: Request, res: Response) => {
    this.userService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public create = async (req: Request, res: Response) => {
    const [errors, createUserDto] = CreateUserDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.userService
      .create(createUserDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public update = async (req: Request, res: Response) => {
    const [errors, updateUserDto] = UpdateUserDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.userService
      .update(updateUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public delete = async (req: Request, res: Response) => {
    this.userService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
