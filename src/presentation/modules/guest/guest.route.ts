import { Router } from 'express';
import { LoggerService } from '@presentation/services';
import { Auth, Commons } from '@presentation/middlewares';
import { GuestController, GuestService } from '.';
import {
  GuestDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';

export class GuestRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * guest
    const guestLogger = new LoggerService('guest.datasource.impl.ts');
    const guestDatasource = new GuestDatasourceImpl(guestLogger);

    const guestService = new GuestService(guestDatasource);
    const guestController = new GuestController(guestService);

    const middleware = {
      getById: [Commons.isValidUUID],
      create: [authMiddleware.validateJwt, Auth.verifyRole(['reception'])],
      update: [authMiddleware.validateJwt, Auth.verifyRole(['reception'])],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole(['reception']),
      ],
    };

    // * endpoints
    route.get('/', guestController.getAll);
    route.post('/get-by-params', guestController.getByParams);
    route.get('/:id', middleware.getById, guestController.getById);
    route.post('/', middleware.create, guestController.create);
    route.put('/', middleware.update, guestController.update);
    route.delete('/:id', middleware.delete, guestController.delete);

    return route;
  }
}
