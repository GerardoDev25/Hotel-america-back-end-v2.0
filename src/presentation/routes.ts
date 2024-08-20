import { Router } from 'express';
import { RoomRoute } from './room';

export class AppRoute {
  constructor() {}

  static get router(): Router {
    const route = Router();

    route.use('/api/room', RoomRoute.routes);

    return route;
  }
}
