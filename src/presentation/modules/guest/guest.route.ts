import { Router } from 'express';
import {
  GuestDatasourceImpl,
  RegisterDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';
import { Auth, Commons } from '@presentation/middlewares';
import { LoggerService } from '@presentation/services';
import {
  GuestRepositoryImpl,
  RegisterRepositoryImpl,
} from '@infrastructure/repositories';
import { UserRolesList } from '@domain/interfaces';
import { GuestController, GuestService } from '.';

export class GuestRoute {
  static routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * register
    const registerLogger = new LoggerService('register.datasource.impl.ts');
    const registerDatasource = new RegisterDatasourceImpl(registerLogger);
    const registerRepository = new RegisterRepositoryImpl(registerDatasource);

    // * guest
    const guestLogger = new LoggerService('guest.datasource.impl.ts');
    const guestDatasource = new GuestDatasourceImpl(guestLogger);
    const guestRepository = new GuestRepositoryImpl(guestDatasource);

    const guestService = new GuestService(guestRepository, registerRepository);
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
    route.get('/:id', middleware.getById, guestController.getById);
    route.post('/', middleware.create, guestController.create);
    route.put('/', middleware.update, guestController.update);
    route.delete('/:id', middleware.delete, guestController.delete);

    return route;
  }
}
