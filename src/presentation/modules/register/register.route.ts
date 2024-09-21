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

    route.get('/', registerController.getAll);
    route.get('/:id', [Commons.isValidUUID], registerController.getById);
    route.post(
      '/',
      [
        authMiddleware.validateJwt,
        authMiddleware.verifyRole(UserRolesList.RECEPTION),
      ],
      registerController.create
    );
    route.put(
      '/',
      [
        authMiddleware.validateJwt,
        authMiddleware.verifyRole(UserRolesList.RECEPTION),
      ],
      registerController.update
    );
    route.delete(
      '/:id',
      [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        authMiddleware.verifyRole(UserRolesList.RECEPTION),
      ],
      registerController.deleted
    );

    return route;
  }
}
