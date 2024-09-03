import winston from 'winston';
import { envs } from '../config';

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

if (envs.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}