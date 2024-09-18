import { Router } from 'express';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import {
  RegisterRepositoryImpl,
  RoomRepositoryImpl,
} from '../../../infrastructure/repositories';
import {
  RegisterDatasourceImpl,
  RoomDatasourceImpl,
} from '../../../infrastructure/datasource';
import { LoggerService } from '../../services';
import { Commons } from '../../middlewares';

export class RegisterRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    const roomLogger = new LoggerService('room.datasource.impl.ts');
    const roomDatasource = new RoomDatasourceImpl(roomLogger);
    const roomRepository = new RoomRepositoryImpl(roomDatasource);

    const registerLogger = new LoggerService('register.datasource.impl.ts');
    const registerDatasource = new RegisterDatasourceImpl(registerLogger);
    const registerRepository = new RegisterRepositoryImpl(registerDatasource);

    const registerService = new RegisterService(
      registerRepository,
      roomRepository
    );
    const registerController = new RegisterController(registerService);

    route.get('/', registerController.getAll);
    route.get('/:id', [Commons.isValidUUID], registerController.getById);
    route.post('/', registerController.create);
    route.put('/', registerController.update);
    route.delete('/:id', [Commons.isValidUUID], registerController.deleted);

    return route;
  }
}
