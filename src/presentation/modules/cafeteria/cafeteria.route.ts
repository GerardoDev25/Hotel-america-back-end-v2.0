import { Router } from 'express';
import { UserRolesList } from '@domain/interfaces';
import { Auth } from '@presentation/middlewares';
import { CafeteriaRepositoryImpl } from '@infrastructure/repositories';
import {
  CafeteriaDatasourceImpl,
  UserDatasourceImpl,
} from '@infrastructure/datasource';
import { LoggerService } from '@src/presentation/services';
import { CafeteriaController, CafeteriaService } from '.';

export class CafeteriaRoute {
  constructor() {}
  static get routes(): Router {
    const route = Router();

    // * auth
    const userLogger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(userLogger);
    const authMiddleware = new Auth(userDatasource);

    // * cafeteria
    const logger = new LoggerService('cafeteria.datasource.impl.ts');
    const cafeteriaDatasource = new CafeteriaDatasourceImpl(logger);
    const cafeteriaRepository = new CafeteriaRepositoryImpl(
      cafeteriaDatasource
    );
    const cafeteriaService = new CafeteriaService(cafeteriaRepository);
    const cafeteriaController = new CafeteriaController(cafeteriaService);

    const middleware = {
      update: [
        authMiddleware.validateJwt,
        Auth.verifyRole([UserRolesList.CAFE]),
      ],
    };

    route.get('/', cafeteriaController.getAll);
    route.put('/', middleware.update, cafeteriaController.update);

    return route;
  }
}
