import { Router } from 'express';
import { AuthController, AuthService } from '.';
import { UserDatasourceImpl } from '../../../infrastructure/datasource';
import { UserRepositoryImpl } from '../../../infrastructure/repositories';
import { LoggerService } from '../../services';

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
