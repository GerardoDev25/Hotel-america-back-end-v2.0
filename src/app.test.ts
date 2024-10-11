import { envs } from '@src/config';
import { Server } from '@src/presentation/server';
import { LoggerService } from '@presentation/services';

jest.mock('../src/presentation/server');

describe('app.ts', () => {
  test('should call server with arguments and start', async () => {
    await import('../src/app');

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      routes: expect.any(Function),
      corsOptions: {
        origin: ['http://localhost:4000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        credentials: true,
      },
      logger: new LoggerService('server.ts'),
    });

    expect(Server.prototype.start).toHaveBeenCalledTimes(1);
    expect(Server.prototype.start).toHaveBeenCalledWith();
  });
});
