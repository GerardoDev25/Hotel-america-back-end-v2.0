import { Router } from 'express';
import {
  AuthRoute,
  RegisterRoute,
  RoomRoute,
  UserRoute,
} from '@presentation/modules';

export class AppRoute {
  constructor() {}

  static get router(): Router {
    const route = Router();

    route.use('/api/auth', AuthRoute.routes);
    route.use('/api/register', RegisterRoute.routes);
    route.use('/api/room', RoomRoute.routes);
    route.use('/api/user', UserRoute.routes);

    return route;
  }
}
