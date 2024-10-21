import { CronServiceSingleton } from '.';

describe('cron.service.ts', () => {
  test('should get and instance of CronServiceSingleton when call a getInstance', () => {
    const job = CronServiceSingleton.getInstance();
    const job2 = CronServiceSingleton.getInstance();

    expect(job).toBe(job2);
    expect(job).toBeInstanceOf(CronServiceSingleton);
  });

  test('should create a job', (done) => {
    const job = CronServiceSingleton.getInstance();
    const mockOnTick = jest.fn();

    job.startJob('create-new-lodging', '* * * * * *', mockOnTick);

    setTimeout(() => {
      expect(mockOnTick).toHaveBeenCalledTimes(1);
      job.stopJob('create-new-lodging');
      done();
    }, 1000);
  });
});
