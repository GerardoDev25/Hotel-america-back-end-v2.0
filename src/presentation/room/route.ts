import { Router } from 'express';
import { RoomService } from './service';
import { RoomController } from './controller';
export class RoomRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    const service = new RoomService();
    const controller = new RoomController(service);

    route.post('/', controller.createRoom);

    return route;
  }
}
