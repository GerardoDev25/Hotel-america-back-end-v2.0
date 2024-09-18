import { DateValidator } from './type-date';

describe('type-date.ts', () => {
  test('should get error message if is undefined', () => {
    expect(DateValidator.isValid(undefined)).toBe('property is required');
  });

  test('should get error message if is empty', () => {
    expect(DateValidator.isValid('')).toBe(
      'property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
  });

  test('should get error message if is not valid iso date', () => {
    expect(DateValidator.isValid('not-valid-date')).toBe(
      'property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format'
    );
  });

  test('should get true if is valid iso date', () => {
    const date = new Date().toISOString().split('T')[0];
    expect(DateValidator.isValid(date)).toBeTruthy();
  });

  test('should get null if is not valid iso date', () => {
    expect(DateValidator.toDate('not-valid-date')).toBeNull();
  });

  test('should get data object if is valid iso date', () => {
    const date = new Date().toISOString().split('T')[0];
    expect(DateValidator.toDate(date)).toBeInstanceOf(Date);
  });
});
