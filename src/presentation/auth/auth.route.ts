import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRoute {
  constructor() {}

  static get routes(): Router {
    const router = Router();

    const controller = new AuthController();

    router.post('/login', controller.login);
    router.post('/refresh-token', controller.refreshToken);

    return router;
  }
}
