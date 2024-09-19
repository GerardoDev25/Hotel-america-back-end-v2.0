import winston from 'winston';
import { logger } from '@src/adapters';

export class LoggerService {
  constructor(
    private readonly service: string,
    private readonly localLogger: winston.Logger = logger
  ) {}

  log(message: string) {
    this.localLogger.log('info', { message, service: this.service });
  }

  error(message: string) {
    this.localLogger.error('error', {
      message,
      service: this.service,
    });
  }
}
