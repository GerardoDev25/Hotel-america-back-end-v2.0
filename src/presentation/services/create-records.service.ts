import { prisma } from '@src/data/postgres';
import { HandleDate } from '@src/utils';
import { CronServiceSingleton, LoggerService } from '.';

interface ICreateCharge {
  registerId: string;
  price: number;
}

export class CreateRecordsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly tasks: CronServiceSingleton
  ) {}

  private createCharge = async ({ price, registerId }: ICreateCharge) => {
    const today = new Date();

    const chargeLodging = await prisma.charge.findFirst({
      where: {
        registerId,
        type: 'lodging',
        createdAt: { gte: today, lt: HandleDate.nextDay(today) },
      },
    });

    if (!chargeLodging) {
      await prisma.charge.create({
        data: {
          description: 'lodging charge',
          amount: price,
          type: 'lodging',
          registerId,
        },
      });
    }
  };

  private recordChargesPerDay = async () => {
    this.logger.log('creating charges lodging per day');
    try {
      const registerIds = await prisma.register.findMany({
        select: { id: true, price: true },
      });

      registerIds.forEach(async ({ id, price }) => {
        await this.createCharge({ price, registerId: id });
      });
    } catch (error) {
      this.logger.error((error as Error).message);
    }
  };

  execute = () => {
    this.logger.log('Job with id "create-new-lodging" started.');
    this.tasks.startJob(
      'create-new-lodging',
      '0 12 * * *',
      this.recordChargesPerDay
    );
  };

  stop = () => {
    this.logger.log('Job with id "create-new-lodging" stopped.');
    this.tasks.stopJob('create-new-lodging');
  };
}
