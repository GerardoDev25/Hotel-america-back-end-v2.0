import { Router } from 'express';
import {
  AuthRoute,
  GuestRoute,
  PaymentRoute,
  RegisterRoute,
  RoomRoute,
  UserRoute,
  ChargeRoute,
} from '@presentation/modules';

export class AppRoute {
  constructor() {}

  static get router(): Router {
    const route = Router();

    route.use('/api/auth', AuthRoute.routes);
    route.use('/api/charge', ChargeRoute.routes);
    route.use('/api/guest', GuestRoute.routes);
    route.use('/api/payment', PaymentRoute.routes);
    route.use('/api/register', RegisterRoute.routes);
    route.use('/api/room', RoomRoute.routes);
    route.use('/api/user', UserRoute.routes);

    return route;
  }
}
