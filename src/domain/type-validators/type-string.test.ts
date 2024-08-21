import { StringValidator } from './type-string';

describe('type-string.ts', () => {
  test('should return true when the input is a valid string', () => {
    const result = StringValidator.isValid('hello');

    expect(result).toBe(true);
  });
});
