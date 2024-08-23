import { Request, Response } from 'express';
import { RoomService } from './service';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
import { CustomError } from '../../domain/error';
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

  public createRoom = async (req: Request, res: Response) => {
    const [errors, createRoomDto] = CreateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ errors });
    }

    this.roomService
      .createRoom(createRoomDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(res, error));
  };

  public updateRoom = async (req: Request, res: Response) => {
    const [errors, updateRoomDto] = UpdateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ errors });
    }

    this.roomService
      .updateRoom(updateRoomDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(res, error));
  };
}
