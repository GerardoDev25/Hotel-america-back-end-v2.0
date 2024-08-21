import { Request, Response } from 'express';
import { RoomService } from './service';
import { CreateRoomDto } from '../../domain/dtos/room';
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  public createRoom = async (req: Request, res: Response) => {
    // return await this.roomService.createRoom(req, res);
    const [errors, createRoomDto] = CreateRoomDto.create(req.body);

    if (errors) {
      return res.status(400).json({ errors });
    }

    return res.status(200).json({
      message: 'Room created successfully',
      data: createRoomDto,
    });
  };
}
