import { StringValidator } from './type-string';

describe('type-string.ts', () => {
  test('should return true when the input is a valid string', () => {
    const result = StringValidator.isValid('hello');

    expect(result).toBe(true);
  });
  test('should return a error message if value is undefined', () => {
    const result = StringValidator.isValid(undefined);

    expect(result).toBe('property is required');
  });
  test('should return a error message if value is not a string', () => {
    const result = StringValidator.isValid(12);
    expect(result).toBe('property most be a string');
  });

  test('should return a error message if value is empty', () => {
    const result = StringValidator.isValid('');
    expect(result).toBe('property cannot be empty');
  });

  test('should return true is value is allow', () => {
    const allowValues = ['normal', 'suit'];
    const value = 'normal';

    const result = StringValidator.mostBe({ value, allowValues });

    expect(result).toBe(true);
  });

  test('should return error message if value is not allow', () => {
    const allowValues = ['normal', 'suit'];
    const value = 'not-allow';

    const result = StringValidator.mostBe({ value, allowValues });

    expect(result).toBe('most be: ' + allowValues.join(', '));
  });

  test('should call isValid function', () => {
    const isValidSpy = jest.spyOn(StringValidator, 'isValid');

    const allowValues = ['normal', 'suit'];
    const value = 'suit';

    StringValidator.mostBe({ value, allowValues });

    expect(isValidSpy).toHaveBeenCalled();
    expect(isValidSpy).toHaveBeenCalledTimes(1);
    expect(isValidSpy).toHaveBeenCalledWith(value);
  });
});
