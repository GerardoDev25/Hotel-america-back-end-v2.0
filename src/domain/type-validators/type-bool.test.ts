import { BooleanValidator } from './type-bool';

describe('type-bool.ts', () => {
  test('should return a true if value is boolean', () => {
    const value = false;
    const result = BooleanValidator.isValid(value);

    expect(result).toBe(true);
  });

  test('should return a error message if value is undefined', () => {
    const value = undefined;
    const result = BooleanValidator.isValid(value);

    expect(result).toBe('property is required');
  });

  test('should return a true if value is true of false in string', () => {
    const value = 'false';
    const value2 = 'true';
    const result = BooleanValidator.isValid(value);
    const result2 = BooleanValidator.isValid(value2);

    expect(result).toBe(true);
    expect(result2).toBe(true);
  });

  test('should return a error message if error is not a boolean', () => {
    const value = 'not bool';

    const result = BooleanValidator.isValid(value);

    expect(result).toBe('property most be a boolean');
  });

  test('should convert to boolean if value is allow', () => {
    const value = 'true';
    const value2 = 'false';
    const result = BooleanValidator.toBoolean(value);
    const result2 = BooleanValidator.toBoolean(value2);

    expect(result).toBe(true);
    expect(result2).toBe(false);
  });

  test('should return null if value is not allow', () => {
    const value = 'not-true';
    const result = BooleanValidator.toBoolean(value);

    expect(result).toBe(null);
  });
});
