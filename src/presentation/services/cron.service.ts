import { CronJob } from 'cron';

type OnTick = () => void;
type CronType = string | Date;
type CronJobId = 'create-new-lodging' | 'create-new-cafeteria';

export class CronService {
  private static instance: CronService;
  private jobs: Map<CronJobId, CronJob> = new Map();

  private constructor() {}

  public static getInstance(): CronService {
    if (!CronService.instance) {
      CronService.instance = new CronService();
    }
    return CronService.instance;
  }

  // * Method to start a cron job
  public startJob(id: CronJobId, cronTime: CronType, onTick: OnTick): void {
    if (this.jobs.has(id)) {
      // console.log(`Job with id "${id}" is already running.`);
      return;
    }

    const job = new CronJob(cronTime, onTick);
    job.start();
    this.jobs.set(id, job);
    // console.log(`Job with id "${id}" started.`);
  }

  // * Method to stop and remove a cron job
  public stopJob(id: CronJobId): void {
    const job = this.jobs.get(id);
    if (job) {
      job.stop();
      this.jobs.delete(id);
      // console.log(`Job with id "${id}" stopped and removed.`);
    } else {
      // console.log(`Job with id "${id}" not found.`);
    }
  }
}
