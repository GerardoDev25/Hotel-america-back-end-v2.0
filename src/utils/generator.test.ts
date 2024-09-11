import { Generator } from './generator';

describe('generator.ts', () => {
  test('should get a boolean randomBoolean()', () => {
    const bool = Generator.randomBoolean();
    expect(typeof bool).toBe('boolean');
  });

  test('should get a number between randomNumberBetween()', () => {
    const min = 1;
    const max = 10;
    const num = Generator.randomNumberBetween(min, max);

    expect(typeof num).toBe('number');
    expect(num).toBeGreaterThanOrEqual(min);
    expect(num).toBeLessThanOrEqual(max);
  });

  test('should throw error if min is greater than max randomNumberBetween()', () => {
    const max = 1;
    const min = 10;

    try {
      Generator.randomNumberBetween(min, max);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('Min must be less than max.');
    }
  });

  test('should get a valid date randomDate()', () => {
    const date = Generator.randomDate();
    const dataObj = new Date(date);

    expect(typeof date).toBe('string');
    expect(dataObj).toBeInstanceOf(Date);
    expect(dataObj).not.toBeNaN();
    expect(typeof dataObj.getTime()).toBe('number');
  });

  test('should get a valid date between randomDateBetween()', () => {
    const startDate = '2024-11-06';
    const endDate = '2024-11-19';

    const date = Generator.randomDateBetween(startDate, endDate);
    const dataObj = new Date(date);

    expect(typeof date).toBe('string');
    expect(dataObj).toBeInstanceOf(Date);
    expect(dataObj).not.toBeNaN();
    expect(typeof dataObj.getTime()).toBe('number');
  });

  test('should throw an error if invalid parameters randomDateBetween()', () => {
    const startDate = 'no';
    const endDate = 'no';

    expect(() => Generator.randomDateBetween(startDate, endDate)).toThrow();
  });

  test('should throw an error if startDate is greater than endDate randomDateBetween()', () => {
    const startDate = '2024-11-19';
    const endDate = '2024-11-06';

    expect(() => Generator.randomDateBetween(startDate, endDate)).toThrow();
  });

  test('should get a valid phone number randomPhone()', () => {
    const phone = Generator.randomPhone();
    expect(typeof phone).toBe('string');
    expect(phone.length).toBeGreaterThan(5);
  });

  test('should get a valid name randomName()', () => {
    const names = ['Alice', 'Bob', 'Emily'];
    const name = Generator.randomName(names);
    expect(typeof name).toBe('string');
    expect(names).toContain(name);
  });

  test('should get a valid name randomUsername()', () => {
    const names = ['Alice', 'Bob', 'Emily', 'Math'];
    const name = Generator.randomUsername(names);
    expect(typeof name).toBe('string');
    expect(names).toContain(name);
  });

  test('should get a password randomPassword()', () => {
    const password = Generator.randomPassword();

    expect(typeof password).toBe('string');
    expect(password.length).toBe(8);
  });
});
