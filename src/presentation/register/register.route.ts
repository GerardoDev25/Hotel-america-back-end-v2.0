import { Router } from 'express';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import {
  RegisterRepositoryImpl,
  RoomRepositoryImpl,
} from '../../infrastructure/repositories';
import {
  RegisterDatasourceImpl,
  RoomDatasourceImpl,
} from '../../infrastructure/datasource';
import { LoggerService } from '../services';
import { Commons } from '../middlewares';

export class RegisterRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    const datasourceLogger = new LoggerService('register.datasource.impl.ts');

    const roomDatasource = new RoomDatasourceImpl(datasourceLogger);
    const roomRepository = new RoomRepositoryImpl(roomDatasource);

    const registerDatasource = new RegisterDatasourceImpl(datasourceLogger);
    const registerRepository = new RegisterRepositoryImpl(registerDatasource);

    const service = new RegisterService(registerRepository, roomRepository);
    const controller = new RegisterController(service);

    route.get('/', controller.getAll);
    route.get('/:id', [Commons.isValidUUID], controller.getById);
    route.post('/', controller.create);
    route.put('/', controller.update);
    route.delete('/:id', [Commons.isValidUUID], controller.deleted);

    return route;
  }
}
