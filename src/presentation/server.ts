import path from 'node:path';
import express, { Router } from 'express';
import cors, { CorsOptions } from 'cors';

import { CreateRecordsService, LoggerService } from '@presentation/services';

import { checkDatabaseConnection } from '@src/data/postgres';
import { envs } from '@src/config';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
  logger?: LoggerService;
  corsOptions?: CorsOptions;
  createRecordsService?: CreateRecordsService;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;

  private readonly publicPath: string;
  private readonly routes: Router;
  private readonly logger: LoggerService | undefined;
  private readonly corsOptions: CorsOptions | undefined;
  private readonly createRecordsService: CreateRecordsService | undefined;

  constructor(options: Options) {
    const {
      port,
      routes,
      public_path = 'public',
      logger,
      corsOptions,
      createRecordsService,
    } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
    this.logger = logger;
    this.corsOptions = corsOptions;
    this.createRecordsService = createRecordsService;
  }

  private loadMiddleware() {
    if (this.corsOptions) {
      this.app.use(cors(this.corsOptions));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.routes);
    this.app.use(express.static(this.publicPath));
    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(
        __dirname,
        '..',
        '..',
        this.publicPath,
        'index.html'
      );
      res.sendFile(indexPath);
    });
  }

  async start() {
    const isDatabaseConnected = await checkDatabaseConnection();

    if (isDatabaseConnected) {
      this.loadMiddleware();
      this.createRecordsService?.execute();
      this.serverListener = this.app.listen(this.port, () => {
        if (envs.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-console
          console.log(`Server running on port ${this.port}`);
        }
      });
    } else {
      this.logger?.error('Database is not connected');
      throw 'database disconnected';
    }
  }

  close() {
    this.createRecordsService?.stop();
    this.serverListener?.close();
  }
}
