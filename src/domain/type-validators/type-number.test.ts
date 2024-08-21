import { NumberValidator } from './type-number';

describe('type-number.ts', () => {
  test('should return true when a valid number is provided', () => {
    const result = NumberValidator.isValid({ value: 10 });
    expect(result).toBe(true);
  });

  test('should return error message if value is NaN', () => {
    const result = NumberValidator.isValid({ value: 'hello' });
    expect(result).toBe('property most be a number');
  });

  test('should return error message if value is falsy', () => {
    const result = NumberValidator.isValid({ value: '' });
    expect(result).toBe('property most be a number');
  });

  test('should return error message when value is undefined and isRequired is true', () => {
    const result = NumberValidator.isValid({
      value: undefined,
      isRequired: true,
    });
    expect(result).toBe('property is required');
  });

  test('should return true when the number is greater than or equal to the minimum value', () => {
    // Arrange
    const value = 15;
    const minValue = 10;

    // Act
    const result = NumberValidator.isMinValue({ value, minValue });

    // Assert
    expect(result).toBe(true);
  });

  test('should return error message if number is min than to the minimum value', () => {
    // Arrange
    const value = 15;
    const minValue = 20;

    // Act
    const result = NumberValidator.isMinValue({ value, minValue });

    // Assert
    expect(result).toBe(
      'property most be a greater than or equal to ' + minValue
    );
  });

  test('should return true when a positive number is provided', () => {
    // Arrange
    const positiveNumber = 10;

    // Act
    const result = NumberValidator.isPositive(positiveNumber);

    // Assert
    expect(result).toBe(true);
  });

  test('should return error message if a negative number is provided', () => {
    // Arrange
    const positiveNumber = -10;

    // Act
    const result = NumberValidator.isPositive(positiveNumber);

    // Assert
    expect(result).toBe('property most be a positive');
  });
});
