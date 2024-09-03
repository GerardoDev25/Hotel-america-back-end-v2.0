import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  DB_PORT: get('DB_PORT').required().asPortNumber(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),

  DATABASE_URL: get('DATABASE_URL').required().asString(),
};
