import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  // * app
  PORT: get('PORT').required().asPortNumber(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),

  // * auth
  JWT_SEED: get('JWT_SEED').required().asString(),
  JWT_DURATION: get('JWT_DURATION').default('2h').asString(),

  // * db
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  DB_PORT: get('DB_PORT').required().asPortNumber(),

  // * prisma
  DATABASE_URL: get('DATABASE_URL').required().asString(),
};
