import { prisma } from '../postgres';
import { seedData } from './data';

seedData;

(async () => {
  try {
    await main();

    console.log('seeded');
    process.exit(0);
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();

async function main() {
  // * delete data
  await prisma.room.deleteMany();
  
  
  // * create data
  await prisma.room.createMany({ data: seedData.rooms });
}
