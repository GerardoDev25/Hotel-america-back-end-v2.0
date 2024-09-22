import { Router } from 'express';

import { UserRolesList } from '@domain/interfaces';
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
        Auth.verifyRole([UserRolesList.ADMIN, UserRolesList.RECEPTION]),
      ],
      update: [
        authMiddleware.validateJwt,
        Auth.verifyRole([
          UserRolesList.ADMIN,
          UserRolesList.RECEPTION,
          UserRolesList.LAUNDRY,
        ]),
      ],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.ADMIN, UserRolesList.RECEPTION]),
      ],
    };

    // * endpoints
    route.get('/', controller.getAllRoom);
    route.get('/:id', middleware.getById, controller.getByIdRoom);
    route.post('/', middleware.create, controller.createRoom);
    route.put('/', middleware.update, controller.updateRoom);
    route.delete('/:id', middleware.delete, controller.deletedRoom);

    return route;
  }
}
