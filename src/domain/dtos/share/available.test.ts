import { AvailableDto } from './available';

describe('available.ts', () => {
  test('should return truthy or flashy', () => {
    const availableDto = AvailableDto.create(true);
    const availableDto2 = AvailableDto.create('true');

    const availableDto3 = AvailableDto.create(false);
    const availableDto4 = AvailableDto.create('false');

    expect(availableDto[1]?.isAvailable).toBeTruthy();
    expect(availableDto2[1]?.isAvailable).toBeTruthy();
    expect(availableDto3[1]?.isAvailable).toBeFalsy();
    expect(availableDto4[1]?.isAvailable).toBeFalsy();
  });

  test('should return undefined', () => {
    const availableDto = AvailableDto.create(undefined);
    const availableDto2 = AvailableDto.create(null);

    expect(availableDto[1]?.isAvailable).toBeUndefined();
    expect(availableDto2[1]?.isAvailable).toBeUndefined();
  });

  test('should return error message', () => {
    const availableDto = AvailableDto.create('no valid');
    const availableDto2 = AvailableDto.create(12);

    expect(availableDto2[0]).toBe('isAvailable most be true or false');
    expect(availableDto[1]).toBeUndefined();
  });
});
