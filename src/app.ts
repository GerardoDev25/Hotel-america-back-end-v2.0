import { envs } from '@src/config/envs';
import { AppRoute } from '@presentation/routes';
import { Server } from '@presentation/server';
import { CreateRecordsService, LoggerService } from '@presentation/services';

(async () => {
  main();
})();

async function main() {
  const logger = new LoggerService('server.ts');
  const loggerRecords = new LoggerService('create-records.service.ts');

  const corsOptions = {
    origin: ['http://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  };

  const createRecordsService = new CreateRecordsService(loggerRecords);

  const server = new Server({
    port: envs.PORT,
    routes: AppRoute.router,
    logger,
    corsOptions,
    createRecordsService,
  });

  server.start();
}
