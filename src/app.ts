import { envs } from '@src/config/envs';
import { AppRoute } from '@presentation/routes';
import { Server } from '@presentation/server';
import { LoggerService } from '@presentation/services';

(async () => {
  main();
})();

async function main() {
  const logger = new LoggerService('server.ts');

  const server = new Server({
    port: envs.PORT,
    routes: AppRoute.router,
    logger,
  });

  server.start();
}
