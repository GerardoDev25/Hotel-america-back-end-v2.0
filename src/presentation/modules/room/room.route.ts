import { Router } from 'express';

import { RoomRepositoryImpl } from '@infrastructure/repositories/';
import { RoomDatasourceImpl } from '@infrastructure/datasource/';

import { Commons } from '@presentation/middlewares';
import { LoggerService } from '@presentation/services';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

export class RoomRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    const datasourceLogger = new LoggerService('room.datasource.impl.ts');

    const datasource = new RoomDatasourceImpl(datasourceLogger);
    const repository = new RoomRepositoryImpl(datasource);

    const service = new RoomService(repository);
    const controller = new RoomController(service);

    route.get('/', controller.getAllRoom);
    route.get('/:id', [Commons.isValidUUID], controller.getByIdRoom);
    route.post('/', controller.createRoom);
    route.put('/', controller.updateRoom);
    route.delete('/:id', [Commons.isValidUUID], controller.deletedRoom);

    return route;
  }
}
