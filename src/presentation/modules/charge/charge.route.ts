import { Router } from 'express';
import { LoggerService } from '@presentation/services';
import { Auth, Commons } from '@presentation/middlewares';
import {
  ChargeDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';
import { ChargeController, ChargeService } from '.';

export class ChargeRoute {
  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * charge
    const logger = new LoggerService('charge.datasource.impl.ts');
    const chargeDatasource = new ChargeDatasourceImpl(logger);
    const chargeService = new ChargeService(chargeDatasource);
    const chargeController = new ChargeController(chargeService);

    const middleware = {
      getAll: [authMiddleware.validateJwt],
      getByParams: [authMiddleware.validateJwt],
      getById: [authMiddleware.validateJwt, Commons.isValidUUID],
      create: [
        authMiddleware.validateJwt,
        Auth.verifyRole(['reception', 'cafe', 'laundry']),
      ],
      update: [
        authMiddleware.validateJwt,
        Auth.verifyRole(['reception', 'cafe', 'laundry']),
      ],
      delete: [
        Commons.isValidUUID,
        authMiddleware.validateJwt,
        Auth.verifyRole(['reception', 'cafe', 'laundry']),
      ],
    };

    // * endpoints
    route.get('/', middleware.getAll, chargeController.getAll);
    route.post(
      '/get-by-params',
      middleware.getByParams,
      chargeController.getByParams
    );
    route.get('/:id', middleware.getById, chargeController.getById);
    route.post('/', middleware.create, chargeController.create);
    route.put('/', middleware.update, chargeController.update);
    route.delete('/:id', middleware.delete, chargeController.delete);
    return route;
  }
}
