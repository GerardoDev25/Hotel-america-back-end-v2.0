import { Router } from 'express';
import { Auth, Commons } from '@presentation/middlewares';
import { LoggerService } from '@presentation/services';
import { BookingService, BookingController } from '.';
import {
  BookingDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';

export class BookingRoute {
  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * booking
    const logger = new LoggerService('booking.datasource.impl.ts');
    const datasource = new BookingDatasourceImpl(logger);
    const service = new BookingService(datasource);
    const controller = new BookingController(service);

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
    route.get('/', controller.getAll);
    route.post('/get-by-params', controller.getByParams);
    route.get('/:id', middleware.getById, controller.getById);
    route.post('/', middleware.create, controller.create);
    route.put('/', middleware.update, controller.update);
    route.delete('/:id', middleware.delete, controller.delete);

    return route;
  }
}
