import { checkDatabaseConnection, prisma } from '../postgres';
import { seedData } from './data';

(async () => {
  try {
    await main();

    console.log('initial data seeded');

    process.exit(0);
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();

async function main() {
  await checkDatabaseConnection();

  // * delete data
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  // * create data
  await prisma.room.createMany({ data: seedData.rooms });
  await prisma.user.createMany({ data: seedData.users });
}
