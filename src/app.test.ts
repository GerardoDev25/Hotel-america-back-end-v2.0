import { envs } from './config';
// import { AppRoute } from './presentation/routes';
// import { Server } from './presentation/server';

// describe('app.ts', () => {
//   test('should start server successfully with valid port and routes', async () => {
//     const mockStart = jest
//       .spyOn(Server.prototype, 'start')
//       .mockImplementation(() => Promise.resolve());
      

//     const mockServer = new Server({ port: envs.PORT, routes: AppRoute.router });

//     await import('../src/app');

//     expect(mockStart).toHaveBeenCalled();
//     mockStart.mockRestore();
//   });

// });

// import { envs } from '../src/config/config';
import { Server } from '../src/presentation/server';

jest.mock('../src/presentation/server');

describe('app.ts', () => {
  test('should call server with arguments and start', async () => {
    await import('../src/app');

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      // publicPath: envs.PUBLIC_PATH,
      routes: expect.any(Function),
    });

    expect(Server.prototype.start).toHaveBeenCalledTimes(1);
    expect(Server.prototype.start).toHaveBeenCalledWith();
    
  });
  
});
