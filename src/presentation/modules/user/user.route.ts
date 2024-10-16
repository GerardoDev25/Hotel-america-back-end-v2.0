import { Router } from 'express';

import { UserRolesList } from '@domain/interfaces';
import { UserRepositoryImpl } from '@infrastructure/repositories';
import { UserDatasourceImpl } from '@infrastructure/datasource';
import { Auth, Commons } from '@presentation/middlewares';
import { LoggerService } from '@presentation/services';
import { UserService, UserController } from './';

export class UserRoute {
  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * user
    const datasource = new UserDatasourceImpl(userLogger);
    const repository = new UserRepositoryImpl(datasource);
    const service = new UserService(repository);
    const controller = new UserController(service);

    const middleware = {
      getById: [Commons.isValidUUID],
      create: [
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.ADMIN]),
      ],
      update: [
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.ADMIN]),
      ],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.ADMIN]),
      ],
    };

    // * endpoints
    route.get('/', controller.getAll);
    route.post('/get-by-params', controller.getByParams);
    route.get('/:id', middleware.getById, controller.getById);
    route.post('/', middleware.create, controller.create);
    route.put('/', middleware.update, controller.update);
    route.delete('/:id', middleware.delete, controller.delete);

    return route;
  }
}
