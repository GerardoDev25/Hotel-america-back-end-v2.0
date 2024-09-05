import { Router } from 'express';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryImpl } from '../../infrastructure/repositories';
import { UserDatasourceImpl } from '../../infrastructure/datasource';
import { CheckDataUser } from '../middlewares/check-data';
import { LoggerService } from '../services';
export class UserRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    const datasourceLogger = new LoggerService('user.datasource.impl.ts');

    const datasource = new UserDatasourceImpl(datasourceLogger);
    const repository = new UserRepositoryImpl(datasource);

    const service = new UserService(repository);
    const controller = new UserController(service);

    route.get('/', controller.getAllUsers);
    route.get('/:id', [CheckDataUser.isValidUUID], controller.getUserById);
    route.post('/', [CheckDataUser.create], controller.createUser);
    route.put('/', [CheckDataUser.update], controller.updateUser);
    route.delete('/:id', [CheckDataUser.isValidUUID], controller.deleteUser);

    return route;
  }
}
