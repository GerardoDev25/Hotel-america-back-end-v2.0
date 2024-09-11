import { ActiveDto } from './active';

describe('active.ts', () => {
  test('should return truthy or flashy', () => {
    const [error1, activeDto] = ActiveDto.create(true);
    const [error2, activeDto2] = ActiveDto.create('true');

    const [error3, activeDto3] = ActiveDto.create(false);
    const [error4, activeDto4] = ActiveDto.create('false');

    expect(error1).toBeUndefined();
    expect(error2).toBeUndefined();
    expect(error3).toBeUndefined();
    expect(error4).toBeUndefined();

    expect(activeDto?.isActive).toBeTruthy();
    expect(activeDto2?.isActive).toBeTruthy();
    expect(activeDto3?.isActive).toBeFalsy();
    expect(activeDto4?.isActive).toBeFalsy();
  });

  test('should return undefined', () => {
    const [error1, activeDto] = ActiveDto.create(undefined);
    const [error2, activeDto2] = ActiveDto.create(null);

    expect(error1).toBeUndefined();
    expect(error2).toBeUndefined();
    expect(activeDto?.isActive).toBeUndefined();
    expect(activeDto2?.isActive).toBeUndefined();
  });

  test('should return error message', () => {
    const [error1, activeDto] = ActiveDto.create('no valid');
    const [error2, activeDto2] = ActiveDto.create(12);

    expect(error1).toBe('isActive most be true or false');
    expect(error2).toBe('isActive most be true or false');

    expect(activeDto?.isActive).toBeUndefined();
    expect(activeDto2?.isActive).toBeUndefined();
  });
});
