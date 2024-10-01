import { Router } from 'express';
import {
  RegisterRepositoryImpl,
  RoomRepositoryImpl,
} from '@infrastructure/repositories';
import {
  RegisterDatasourceImpl,
  RoomDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';

import { LoggerService } from '@presentation/services';
import { Auth, Commons } from '@presentation/middlewares';
import { UserRolesList } from '@domain/interfaces';
import { RegisterController, RegisterService } from './';

export class RegisterRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * room
    const roomLogger = new LoggerService('room.datasource.impl.ts');
    const roomDatasource = new RoomDatasourceImpl(roomLogger);
    const roomRepository = new RoomRepositoryImpl(roomDatasource);

    // * register
    const registerLogger = new LoggerService('register.datasource.impl.ts');
    const registerDatasource = new RegisterDatasourceImpl(registerLogger);
    const registerRepository = new RegisterRepositoryImpl(registerDatasource);

    const registerService = new RegisterService(
      registerRepository,
      roomRepository
    );
    const registerController = new RegisterController(registerService);

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
    route.get('/', registerController.getAll);
    route.get('/:id', middleware.getById, registerController.getById);
    route.post('/', middleware.create, registerController.create);
    route.put('/', middleware.update, registerController.update);
    route.delete('/:id', middleware.delete, registerController.delete);

    return route;
  }
}
