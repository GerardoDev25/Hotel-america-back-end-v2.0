import { envs } from './config/envs';
import { AppRoute } from './presentation/routes';
import { Server } from './presentation/server';

export const testServer = new Server({ port: envs.PORT, routes: AppRoute.router });
