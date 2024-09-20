import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const checkDatabaseConnection = async () => {
  const prismaCheck = new PrismaClient();
  try {
    await prismaCheck.$connect();
    prismaCheck.$disconnect();
    return true;
  } catch (error: any) {
    prismaCheck.$disconnect();
    // eslint-disable-next-line no-console
    console.error('Error connecting to the database:', error.message);
    return false;
  }
};
