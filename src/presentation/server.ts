import path from 'node:path';
import express, { Router } from 'express';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;

  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  private loadMiddleware() {
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
    console.log();

    this.loadMiddleware();

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  close() {
    this.serverListener?.close();
  }
}
