import { envs } from './config/envs';
import { AppRoute } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
  main();
})();

async function main() {
  const server = new Server({ port: envs.PORT, routes: AppRoute.router });

  server.start();
}
