import { checkDatabaseConnection, prisma } from '../postgres';
import { generateChargesToDB } from './charge';
import { seedData } from './data';
import { generateGuestsToDB } from './guest';
import { generatePaymentsToDB } from './payment';

(async () => {
  try {
    await main();

    // eslint-disable-next-line no-console
    console.log('initial data seeded');

    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();

async function main() {
  await checkDatabaseConnection();

  // * delete data
  await prisma.booking.deleteMany();
  await prisma.cafeteria.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.country.deleteMany();
  await prisma.register.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  // * create data
  await prisma.booking.createMany({ data: seedData.bookings });
  await prisma.country.createMany({ data: seedData.countries });
  await prisma.room.createMany({ data: seedData.rooms });
  await prisma.user.createMany({ data: seedData.users });

  // * create registers
  const roomsDB = await prisma.room.findMany({
    where: { state: 'occupied' },
    select: { id: true, betsNumber: true },
  });

  const roomsId = roomsDB
    .flatMap((id) => Object.values(id)[0])
    .slice(0, 5) as string[];

  const user = await prisma.user.findFirst({
    where: { role: 'reception', isActive: true },
  });

  await prisma.$transaction(async (tx) => {
    // * 1 set rooms as unavailable
    await tx.room.updateMany({
      where: { id: { in: roomsId } },
      data: { isAvailable: false },
    });

    // * 2 create register and initial charge
    await tx.register.createMany({
      data: roomsId.map((id) => ({
        userId: user!.id,
        roomId: id,
        guestsNumber: roomsDB.find((room) => room.id === id)!.betsNumber * 2,
        price: roomsDB.find((room) => room.id === id)!.betsNumber * 1000,
        checkIn: new Date(),
        checkOut: new Date(),
      })),
    });
  });

  const registersDB = await prisma.register.findMany({
    where: { userId: user!.id },
    select: {
      id: true,
      guestsNumber: true,
      checkOut: true,
      checkIn: true,
      room: { select: { roomNumber: true } },
    },
  });

  // * create guests
  const guests = generateGuestsToDB(registersDB);
  await prisma.guest.createMany({ data: guests });

  // * create charges
  const charges = generateChargesToDB(registersDB);
  await prisma.charge.createMany({ data: charges });

  // * create payments
  const payments = generatePaymentsToDB(registersDB);
  await prisma.payment.createMany({ data: payments });

  // * create cafeteria records
  const guestIds = await prisma.guest.findMany({ select: { id: true } });
  await Promise.all(
    guestIds.map(({ id }) =>
      prisma.cafeteria.create({
        data: {
          isServed: false,
          guest: { connect: { id } },
        },
      })
    )
  );
}
