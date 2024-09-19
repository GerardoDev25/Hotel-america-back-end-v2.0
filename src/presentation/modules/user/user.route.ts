import { Router } from 'express';

import { UserRepositoryImpl } from '@infrastructure/repositories';
import { UserDatasourceImpl } from '@infrastructure/datasource';

import { Commons } from '@presentation/middlewares';
import { LoggerService } from '@presentation/services';
import { UserService } from './user.service';
import { UserController } from './user.controller';

export class UserRoute {
  static get routes(): Router {
    const route = Router();

    const datasourceLogger = new LoggerService('user.datasource.impl.ts');

    const datasource = new UserDatasourceImpl(datasourceLogger);
    const repository = new UserRepositoryImpl(datasource);

    const service = new UserService(repository);
    const controller = new UserController(service);

    route.get('/', controller.getAllUsers);
    route.get('/:id', [Commons.isValidUUID], controller.getUserById);
    route.post('/', controller.createUser);
    route.put('/', controller.updateUser);
    route.delete('/:id', [Commons.isValidUUID], controller.deleteUser);

    return route;
  }
}
