import winston from 'winston';
import { LoggerService } from './logger.service';

describe('logger.service.ts', () => {
  const service = 'test-service';
  const localLogger = {
    log: jest.fn(),
    error: jest.fn(),
  } as unknown as winston.Logger;

  const logger = new LoggerService(service, localLogger);

  test('should call log function', () => {
    const message = 'test in log logger';
    logger.log(message);

    expect(localLogger.log).toHaveBeenCalled();
    expect(localLogger.log).toHaveBeenCalledTimes(1);
    expect(localLogger.log).toHaveBeenCalledWith('info', { message, service });
  });

  test('should call error function', () => {
    const message = 'test in log logger';
    logger.error(message);

    expect(localLogger.error).toHaveBeenCalled();
    expect(localLogger.error).toHaveBeenCalledTimes(1);
    expect(localLogger.error).toHaveBeenCalledWith('error', {
      message,
      service,
    });
  });
});
