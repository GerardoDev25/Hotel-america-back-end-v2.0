import { envs } from './config';
import { AppRoute } from './presentation/routes';
import { Server } from './presentation/server';

describe('app.ts', () => {
  test('should start server successfully with valid port and routes', async () => {
    const mockStart = jest
      .spyOn(Server.prototype, 'start')
      .mockImplementation(() => Promise.resolve());
    const mockServer = new Server({ port: envs.PORT, routes: AppRoute.router });

    await import('../src/app');

    expect(mockStart).toHaveBeenCalled();
    mockStart.mockRestore();
  });

});
