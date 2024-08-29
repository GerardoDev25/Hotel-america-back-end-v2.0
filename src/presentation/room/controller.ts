import { Request, Response } from 'express';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { CustomError } from '../../domain/error';
import { RoomService } from './service';
import { AvailableDto, PaginationDto } from '../../domain/dtos/share';
import { variables } from '../../domain/variables';

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: `Internal server error - check Logs` });
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
      return res.status(400).json({ error: paginationError });
    }
    if (isAvailableError) {
      return res.status(400).json({ error: isAvailableError });
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
    const createRoomDto = CreateRoomDto.create(req.body);

    this.roomService
      .create(createRoomDto)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public updateRoom = async (req: Request, res: Response) => {
    const updateRoomDto = UpdateRoomDto.create(req.body);

    this.roomService
      .update(updateRoomDto)
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
