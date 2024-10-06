import { Router } from 'express';
import { UserRolesList } from '@domain/interfaces';
import { LoggerService } from '@presentation/services';
import { Auth, Commons } from '@presentation/middlewares';
import { PaymentRepositoryImpl } from '@infrastructure/repositories';
import {
  PaymentDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';
import { PaymentController, PaymentService } from '.';

export class PaymentRoute {
  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * payment
    const logger = new LoggerService('payment.datasource.impl.ts');
    const paymentDatasource = new PaymentDatasourceImpl(logger);
    const paymentRepository = new PaymentRepositoryImpl(paymentDatasource);
    const paymentService = new PaymentService(paymentRepository);
    const paymentController = new PaymentController(paymentService);

    const middleware = {
      getAll: [authMiddleware.validateJwt],
      getById: [authMiddleware.validateJwt, Commons.isValidUUID],
      create: [
        authMiddleware.validateJwt,
        Auth.verifyRole([
          UserRolesList.RECEPTION,
          UserRolesList.CAFE,
          UserRolesList.LAUNDRY,
        ]),
      ],
      update: [
        authMiddleware.validateJwt,
        Auth.verifyRole([
          UserRolesList.RECEPTION,
          UserRolesList.CAFE,
          UserRolesList.LAUNDRY,
        ]),
      ],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole([
          UserRolesList.RECEPTION,
          UserRolesList.CAFE,
          UserRolesList.LAUNDRY,
        ]),
      ],
    };

    // * endpoints
    route.get('/', middleware.getAll, paymentController.getAll);
    route.get('/:id', middleware.getById, paymentController.getById);
    route.post('/', middleware.create, paymentController.create);
    route.put('/', middleware.update, paymentController.update);
    route.delete('/:id', middleware.delete, paymentController.delete);
    return route;
  }
}
