import { Router } from 'express';

import { RoomRepositoryImpl } from '@infrastructure/repositories';
import {
  RoomDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';
import { Auth, Commons } from '@presentation/middlewares';
import { LoggerService } from '@presentation/services';
import { RoomService, RoomController } from './';

export class RoomRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * room
    const datasourceLogger = new LoggerService('room.datasource.impl.ts');
    const datasource = new RoomDatasourceImpl(datasourceLogger);
    const repository = new RoomRepositoryImpl(datasource);
    const service = new RoomService(repository);
    const controller = new RoomController(service);

    const middleware = {
      getById: [Commons.isValidUUID],
      create: [
        authMiddleware.validateJwt,
        Auth.verifyRole(['admin', 'reception']),
      ],
      update: [
        authMiddleware.validateJwt,
        Auth.verifyRole(['admin', 'reception', 'laundry']),
      ],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole(['admin', 'reception']),
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
