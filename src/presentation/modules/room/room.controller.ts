import { Request, Response } from 'express';

import { AvailableDto, PaginationDto } from '@domain/dtos/share';
import { CreateRoomDto, UpdateRoomDto } from '@domain/dtos/room';
import { CustomError } from '@domain/error';
import { variables } from '@domain/variables';

import { RoomService } from './room.service';

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

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

  public getAllRoom = async (req: Request, res: Response) => {
    const page = req.query.page ?? variables.PAGINATION_PAGE_DEFAULT;
    const limit = req.query.limit ?? variables.PAGINATION_LIMIT_DEFAULT;
    const available = req.query.isAvailable as string;

    const [paginationError, paginationDto] = PaginationDto.create(
      +page,
      +limit
    );
    const [isAvailableError, availableDto] = AvailableDto.create(available);

    if (paginationError) {
      return res.status(400).json({ ok: false, errors: [paginationError] });
    }
    if (isAvailableError) {
      return res.status(400).json({ ok: false, errors: [isAvailableError] });
    }

    this.roomService
      .getAll(paginationDto!, availableDto!.isAvailable)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public getByIdRoom = async (req: Request, res: Response) => {
    this.roomService
      .getById(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public createRoom = async (req: Request, res: Response) => {
    const [errors, createRoomDto] = CreateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }

    this.roomService
      .create(createRoomDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public updateRoom = async (req: Request, res: Response) => {
    const [errors, updateRoomDto] = UpdateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ ok: false, errors });
    }
    this.roomService
      .update(updateRoomDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };

  public deletedRoom = async (req: Request, res: Response) => {
    this.roomService
      .delete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
