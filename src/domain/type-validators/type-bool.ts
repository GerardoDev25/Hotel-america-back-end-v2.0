export class BooleanValidator {
  static isValid = (value: any): true | string => {
    if (value === undefined) return 'property is required';

    if (value === 'true' || value === 'false') return true;

    if (typeof value !== 'boolean') return 'property most be a boolean';

    return true;
  };

  static toBoolean = (value: any): boolean | null => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;

    return null;
  };
}
