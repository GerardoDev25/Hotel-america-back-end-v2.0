import { Router } from 'express';
import {
  AuthRoute,
  BookingRoute,
  CafeteriaRoute,
  ChargeRoute,
  CountryRoute,
  GuestRoute,
  PaymentRoute,
  RegisterRoute,
  RoomRoute,
  UserRoute,
} from '@presentation/modules';

export class AppRoute {
  constructor() {}

  static get router(): Router {
    const route = Router();

    route.use('/api/auth', AuthRoute.routes);
    route.use('/api/booking', BookingRoute.routes);
    route.use('/api/cafeteria', CafeteriaRoute.routes);
    route.use('/api/charge', ChargeRoute.routes);
    route.use('/api/country', CountryRoute.routes);
    route.use('/api/guest', GuestRoute.routes);
    route.use('/api/payment', PaymentRoute.routes);
    route.use('/api/register', RegisterRoute.routes);
    route.use('/api/room', RoomRoute.routes);
    route.use('/api/user', UserRoute.routes);

    return route;
  }
}
