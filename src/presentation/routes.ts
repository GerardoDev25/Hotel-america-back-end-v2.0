import { Router } from 'express';
import { RoomRoute } from './room';
import { UserRoute } from './user';
import { RegisterRoute } from './register';
import { AuthRoute } from './auth/auth.route';

export class AppRoute {
  constructor() {}

  static get router(): Router {
    const route = Router();

    route.use('/api/room', RoomRoute.routes);
    route.use('/api/user', UserRoute.routes);
    route.use('/api/register', RegisterRoute.routes);
    route.use('/api/auth', AuthRoute.routes);

    return route;
  }
}
