import { NumberValidator } from './type-number';

describe('type-number.ts', () => {
  test('should return true when a valid number is provided', () => {
    const result = NumberValidator.isValid(10);
    expect(result).toBe(true);
  });

  test('should return error message if value is NaN', () => {
    const result = NumberValidator.isValid('hello');
    expect(result).toBe('property most be a number');
  });

  test('should return error message if value is falsy', () => {
    const result = NumberValidator.isValid('');
    expect(result).toBe('property most be a number');
  });

  test('should return error message when value is undefined and isRequired is true', () => {
    const result = NumberValidator.isValid(undefined);
    expect(result).toBe('property is required');
  });

  test('should return true when the number is greater than or equal to the minimum value', () => {
    const value = 15;
    const minValue = 10;
    const result = NumberValidator.isMinValue({ value, minValue });

    expect(result).toBe(true);
  });

  test('should return error message if number is min than to the minimum value', () => {
    const value = 15;
    const minValue = 20;
    const result = NumberValidator.isMinValue({ value, minValue });

    expect(result).toBe(
      'property most be greater than or equal to ' + minValue
    );
  });

  test('should return true when a positive number is provided', () => {
    const positiveNumber = 10;
    const result = NumberValidator.isPositive(positiveNumber);

    expect(result).toBe(true);
  });

  test('should return error message if a negative number is provided', () => {
    const positiveNumber = -10;
    const result = NumberValidator.isPositive(positiveNumber);

    expect(result).toBe('property most be a positive');
  });
});
