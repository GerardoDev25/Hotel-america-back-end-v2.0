import { Router } from 'express';
import { RoomService } from './service';
import { RoomController } from './controller';
import { RoomRepositoryImpl } from '../../infrastructure/repositories/';
import { RoomDatasourceImpl } from '../../infrastructure/datasource';
export class RoomRoute {
  constructor() {}

  static get routes(): Router {
    const route = Router();

    const datasource = new RoomDatasourceImpl();
    const repository = new RoomRepositoryImpl(datasource);
    const service = new RoomService(repository);
    const controller = new RoomController(service);

    route.post('/', controller.createRoom);
    route.put('/', controller.updateRoom);

    return route;
  }
}
