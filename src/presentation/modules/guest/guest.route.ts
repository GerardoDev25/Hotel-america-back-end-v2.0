import { Router } from 'express';
import { UserRolesList } from '@domain/interfaces';
import { LoggerService } from '@presentation/services';
import { Auth, Commons } from '@presentation/middlewares';
import { GuestRepositoryImpl } from '@infrastructure/repositories';
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
    const guestRepository = new GuestRepositoryImpl(guestDatasource);

    const guestService = new GuestService(guestRepository);
    const guestController = new GuestController(guestService);

    const middleware = {
      getById: [Commons.isValidUUID],
      create: [
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.RECEPTION]),
      ],
      update: [
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.RECEPTION]),
      ],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.RECEPTION]),
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
