import { LoggerService } from './logger.service';
import { CronServiceSingleton } from './cron.service';
import { CreateRecordsService } from './create-records.service';

describe('create-records.service.test.ts', () => {
  const mockLogger = {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  } as unknown as LoggerService;
  const mockTask = {
    startJob: jest.fn(),
    stopJob: jest.fn(),
  } as unknown as CronServiceSingleton;

  const createRecordsService = new CreateRecordsService(mockLogger, mockTask);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should start a job', () => {
    createRecordsService.execute();

    expect(mockTask.startJob).toHaveBeenCalledWith(
      'create-new-lodging',
      '0 12 * * *',
      expect.any(Function)
    );
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Job with id "create-new-lodging" started.'
    );
  });

  test('should stop a job', () => {
    createRecordsService.stop();

    expect(mockTask.stopJob).toHaveBeenCalledWith('create-new-lodging');
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Job with id "create-new-lodging" stopped.'
    );
  });
});
