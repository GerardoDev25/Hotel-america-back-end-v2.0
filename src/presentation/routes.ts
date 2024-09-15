import { Router } from 'express';
import { RoomRoute } from './room';
import { UserRoute } from './user';
import { RegisterRoute } from './register';

export class AppRoute {
  constructor() {}

  static get router(): Router {
    const route = Router();

    route.use('/api/room', RoomRoute.routes);
    route.use('/api/user', UserRoute.routes);
    route.use('/api/register', RegisterRoute.routes);

    return route;
  }
}
