import { Router } from 'express';
import {
  RegisterDatasourceImpl,
  RoomDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';

import { LoggerService } from '@presentation/services';
import { Auth, Commons } from '@presentation/middlewares';
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

    // * register
    const registerLogger = new LoggerService('register.datasource.impl.ts');
    const registerDatasource = new RegisterDatasourceImpl(registerLogger);

    const registerService = new RegisterService(
      registerDatasource,
      roomDatasource
    );
    const registerController = new RegisterController(registerService);

    const middleware = {
      getById: [Commons.isValidUUID],
      checkIn: [authMiddleware.validateJwt, Auth.verifyRole(['reception'])],
      checkOut: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole(['reception']),
      ],
      update: [authMiddleware.validateJwt, Auth.verifyRole(['reception'])],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole(['reception']),
      ],
    };

    // * endpoints
    route.get('/', registerController.getAll);
    route.post('/get-by-params', registerController.getByParams);
    route.get('/:id', middleware.getById, registerController.getById);

    route.post('/check-in/', middleware.checkIn, registerController.checkIn);
    route.put('/', middleware.update, registerController.update);

    route.delete('/:id', middleware.delete, registerController.delete);
    route.delete(
      '/check-out/:id',
      middleware.checkOut,
      registerController.checkOut
    );

    return route;
  }
}
