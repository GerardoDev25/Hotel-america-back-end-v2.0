import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const checkDatabaseConnection = async () => {
  const prismaCheck = new PrismaClient();
  try {
    await prismaCheck.$connect();
    // console.log('Connected to the database');
    prismaCheck.$disconnect();
  } catch (error:any) {
    prismaCheck.$disconnect();
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};
