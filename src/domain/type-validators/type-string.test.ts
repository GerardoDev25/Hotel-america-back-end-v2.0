import { Uuid } from '../../adapters';
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
    expect(result).toBe('property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format');
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

  test('should be a uuid', () => {
    const id = Uuid.v4();
    const validId = StringValidator.isValidUUID(id);
    expect(validId).toBeTruthy();
  });

  test('should get error message if not valid uuid', () => {
    const id = 'not uuid';
    const validId = StringValidator.isValidUUID(id);
    expect(validId).toBe('is not a valid uuid');
  });
});
