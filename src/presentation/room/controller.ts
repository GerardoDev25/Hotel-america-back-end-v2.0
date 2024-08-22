import { Request, Response } from 'express';
import { RoomService } from './service';
import { CreateRoomDto, UpdateRoomDto } from '../../domain/dtos/room';
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  public createRoom = async (req: Request, res: Response) => {
    const [errors, createRoomDto] = CreateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ errors });
    }

    return res.status(200).json({
      message: 'Room created successfully',
      data: createRoomDto,
    });
  };

  public updateRoom = async (req: Request, res: Response) => {
    const [errors, updateRoomDto] = UpdateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ errors });
    }

    return res.status(200).json({
      message: 'Room update successfully',
      data: updateRoomDto,
    });
  };
}
