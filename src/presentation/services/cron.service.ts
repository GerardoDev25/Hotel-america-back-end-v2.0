import { CronJob } from 'cron';

type OnTick = () => void;
type CronType = string | Date;
type CronJobId = 'create-new-lodging' | 'create-new-cafeteria';

export class CronServiceSingleton {
  private static instance: CronServiceSingleton;
  private jobs: Map<CronJobId, CronJob> = new Map();

  private constructor() {}

  public static getInstance(): CronServiceSingleton {
    if (!CronServiceSingleton.instance) {
      CronServiceSingleton.instance = new CronServiceSingleton();
    }
    return CronServiceSingleton.instance;
  }

  public startJob(id: CronJobId, cronTime: CronType, onTick: OnTick): void {
    if (this.jobs.has(id)) return;

    const job = new CronJob(cronTime, onTick);
    job.start();
    this.jobs.set(id, job);
  }

  public stopJob(id: CronJobId): void {
    const job = this.jobs.get(id);
    if (job) {
      job.stop();
      this.jobs.delete(id);
    }
  }
}
