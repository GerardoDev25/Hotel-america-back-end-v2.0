import { ActiveDto } from './active';

describe('active.ts', () => {
  test('should return truthy or flashy', () => {
    const activeDto = ActiveDto.create(true);
    const activeDto2 = ActiveDto.create('true');

    const activeDto3 = ActiveDto.create(false);
    const activeDto4 = ActiveDto.create('false');

    expect(activeDto[1]?.isActive).toBeTruthy();
    expect(activeDto2[1]?.isActive).toBeTruthy();
    expect(activeDto3[1]?.isActive).toBeFalsy();
    expect(activeDto4[1]?.isActive).toBeFalsy();
  });

  test('should return undefined', () => {
    const activeDto = ActiveDto.create(undefined);
    const activeDto2 = ActiveDto.create(null);

    expect(activeDto[1]?.isActive).toBeUndefined();
    expect(activeDto2[1]?.isActive).toBeUndefined();
  });

  test('should return error message', () => {
    const activeDto = ActiveDto.create('no valid');
    const activeDto2 = ActiveDto.create(12);

    expect(activeDto2[0]).toBe('isActive most be true or false');
    expect(activeDto[1]).toBeUndefined();
  });
});
