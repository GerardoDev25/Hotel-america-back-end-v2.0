import { Router } from 'express';
import { RoomService } from './service';
import { RoomController } from './controller';
import { RoomRepositoryImpl } from '../../infrastructure/repositories/';
import { RoomDatasourceImpl } from '../../infrastructure/datasource/';
import { CheckDataRoom } from '../middlewares/check-data';
import { LoggerService } from '../services';
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
    route.get('/:id', controller.getByIdRoom);
    route.post('/', [CheckDataRoom.create], controller.createRoom);
    route.put('/', [CheckDataRoom.update], controller.updateRoom);
    route.delete('/:id', controller.deletedRoom);

    return route;
  }
}
