import winston from 'winston';

const { combine, timestamp, json } = winston.format;

export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: './logs/info.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export function buildLogger(service: string) {
  return {
    log: (message: string) => {
      logger.log('info', { message, service });
    },
    error: (message: string) => {
      logger.error('error', {
        message,
        service,
      });
    },
  };
}
