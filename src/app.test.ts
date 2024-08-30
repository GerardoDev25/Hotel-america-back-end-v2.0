import { envs } from './config';
import { Server } from '../src/presentation/server';

jest.mock('../src/presentation/server');

describe('app.ts', () => {
  test('should call server with arguments and start', async () => {
    await import('../src/app');

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      routes: expect.any(Function),
    });

    expect(Server.prototype.start).toHaveBeenCalledTimes(1);
    expect(Server.prototype.start).toHaveBeenCalledWith();
  });
});
