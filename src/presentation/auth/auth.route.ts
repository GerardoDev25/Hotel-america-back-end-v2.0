import { Router } from 'express';
import { AuthController } from './auth.controller';
import { UserDatasourceImpl } from '../../infrastructure/datasource';
import { UserRepositoryImpl } from '../../infrastructure/repositories';
import { LoggerService } from '../services';
import { AuthService } from './auth.service';

export class AuthRoute {
  constructor() {}

  static get routes(): Router {
    const router = Router();

    const logger = new LoggerService('AuthRoute');
    const userDatasource = new UserDatasourceImpl(logger);
    const userRepository = new UserRepositoryImpl(userDatasource);
    const authService = new AuthService(userRepository);
    const controller = new AuthController(authService);

    router.post('/login', controller.login);
    router.post('/refresh-token', controller.refreshToken);

    return router;
  }
}
