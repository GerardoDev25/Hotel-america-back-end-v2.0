import { AvailableDto } from './available';

describe('available.ts', () => {
  test('should return truthy or flashy', () => {
    const [error1, availableDto] = AvailableDto.create(true);
    const [error2, availableDto2] = AvailableDto.create('true');

    const [error3, availableDto3] = AvailableDto.create(false);
    const [error4, availableDto4] = AvailableDto.create('false');

    expect(error1).toBeUndefined();
    expect(error2).toBeUndefined();
    expect(error3).toBeUndefined();
    expect(error4).toBeUndefined();

    expect(availableDto?.isAvailable).toBeTruthy();
    expect(availableDto2?.isAvailable).toBeTruthy();
    expect(availableDto3?.isAvailable).toBeFalsy();
    expect(availableDto4?.isAvailable).toBeFalsy();
  });

  test('should return undefined', () => {
    const [error1, availableDto] = AvailableDto.create(undefined);
    const [error2, availableDto2] = AvailableDto.create(null);

    expect(error1).toBeUndefined();
    expect(error2).toBeUndefined();

    expect(availableDto?.isAvailable).toBeUndefined();
    expect(availableDto2?.isAvailable).toBeUndefined();
  });

  test('should return error message', () => {
    const [error1, availableDto] = AvailableDto.create('no valid');
    const [error2, availableDto2] = AvailableDto.create(12);

    expect(error1).toBe('isAvailable most be true or false');
    expect(error2).toBe('isAvailable most be true or false');

    expect(availableDto?.isAvailable).toBeUndefined();
    expect(availableDto2?.isAvailable).toBeUndefined();
  });
});
