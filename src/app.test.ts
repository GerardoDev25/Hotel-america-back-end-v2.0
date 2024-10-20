import { envs } from '@src/config';
import { Server } from '@src/presentation/server';
import { CreateRecordsService, LoggerService } from '@presentation/services';

jest.mock('../src/presentation/server');

describe('app.ts', () => {
  test('should call server with arguments and start', async () => {
    await import('../src/app');

    const corsOptions = {
      origin: ['http://localhost:4000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      credentials: true,
    };

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      routes: expect.any(Function),
      logger: new LoggerService('server.ts'),
      corsOptions,
      createRecordsService: expect.any(CreateRecordsService),
    });

    expect(Server.prototype.start).toHaveBeenCalledTimes(1);
    expect(Server.prototype.start).toHaveBeenCalledWith();
  });
});
