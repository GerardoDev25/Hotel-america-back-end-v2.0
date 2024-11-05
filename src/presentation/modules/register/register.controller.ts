import { Response, Request } from 'express';
import { CustomError } from '@domain/error';
import { variables } from '@domain/variables';
import {
  PaginationDto,
  CreateGuestDto,
  CreateRegisterDto,
  FilterRegisterDto,
  UpdateRegisterDto,
} from '@domain/dtos';
import { RegisterService } from '.';

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

  private verifyCheckIn = (
    req: Request
  ): [
    string[]?,
    data?: { registerDto: CreateRegisterDto; guestDtos: CreateGuestDto[] },
  ] => {
    // * verify request object
    const reqErrors = [];
    if (!req.body.register) reqErrors.push('register object required');
    if (!req.body.guests || !Array.isArray(req.body.guests))
      reqErrors.push('guests array required or not valid');

    if (reqErrors.length > 0) return [reqErrors, undefined];

    // * create registerDto
    const [registerErrors, registerDto] = CreateRegisterDto.create({
      ...req.body.register,
      userId: req.body.userId,
    });
    if (registerErrors) return [registerErrors, undefined];

    // * create guestDtos
    const guestDtos: CreateGuestDto[] = [];
    for (const guest of req.body.guests) {
      const [guestErrors, guestDto] = CreateGuestDto.create(guest);
      if (guestErrors) return [guestErrors, undefined];
      guestDtos.push(guestDto!);
    }
    return [undefined, { registerDto: registerDto!, guestDtos }];
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

    this.registerService
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

    const [filterError, filterDto] = FilterRegisterDto.create(req.body);
    if (filterError) {
      return res.status(400).json({ ok: false, errors: filterError });
    }

    return this.registerService
      .getByParams(paginationDto!, filterDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  getById = async (req: Request, res: Response) => {
    this.registerService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  checkIn = async (req: Request, res: Response) => {
    const [errors, data] = this.verifyCheckIn(req);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.registerService
      .checkIn(data!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  checkOut = async (req: Request, res: Response) => {
    this.registerService
      .checkOut(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  update = async (req: Request, res: Response) => {
    const [errors, updateRegisterDto] = UpdateRegisterDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.registerService
      .update(updateRegisterDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  delete = async (req: Request, res: Response) => {
    this.registerService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
