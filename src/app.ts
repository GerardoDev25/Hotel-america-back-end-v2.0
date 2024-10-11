import { envs } from '@src/config/envs';
import { AppRoute } from '@presentation/routes';
import { Server } from '@presentation/server';
import { LoggerService } from '@presentation/services';

(async () => {
  main();
})();

async function main() {
  const logger = new LoggerService('server.ts');

  const corsOptions = {
    origin: ['http://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  };

  const server = new Server({
    port: envs.PORT,
    routes: AppRoute.router,
    logger,
    corsOptions,
  });

  server.start();
}
