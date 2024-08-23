import { Request, Response } from 'express';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { CustomError } from '../../domain/error';
import { RoomService } from './service';
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: `Internal server error - check Logs}` });
  };

  public getAllRoom = async (req: Request, res: Response) => {
    this.roomService
      .getAll()
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
      return res.status(400).json({ errors });
    }

    this.roomService
      .create(createRoomDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public updateRoom = async (req: Request, res: Response) => {
    const [errors, updateRoomDto] = UpdateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ errors });
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
