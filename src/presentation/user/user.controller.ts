import { Request, Response } from 'express';

import { CustomError } from '../../domain/error';
import { UserService } from './user.service';
import { ActiveDto, PaginationDto } from '../../domain/dtos/share';
import { variables } from '../../domain/variables';
import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user/';

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

  public getAllUsers = async (req: Request, res: Response) => {
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

  public getUserById = async (req: Request, res: Response) => {
    this.userService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public createUser = async (req: Request, res: Response) => {
    const createUserDto = CreateUserDto.create(req.body);

    this.userService
      .create(createUserDto)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public updateUser = async (req: Request, res: Response) => {
    const updateUserDto = UpdateUserDto.create(req.body);

    this.userService
      .update(updateUserDto)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public deleteUser = async (req: Request, res: Response) => {
    this.userService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
