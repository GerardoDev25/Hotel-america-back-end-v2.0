import { Router } from 'express';

import { UserDatasourceImpl } from '@infrastructure/datasource';
import { UserRepositoryImpl } from '@infrastructure/repositories';

import { LoggerService } from '@presentation/services';

import { AuthController, AuthService } from '.';

export class AuthRoute {
  constructor() {}

  static get routes(): Router {
    const router = Router();

    const logger = new LoggerService('user.datasource.impl.ts');
    const userDatasource = new UserDatasourceImpl(logger);
    const userRepository = new UserRepositoryImpl(userDatasource);

    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    router.post('/login', authController.login);
    router.post('/refresh-token', authController.refreshToken);

    return router;
  }
}
