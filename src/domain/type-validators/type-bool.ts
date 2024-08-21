interface IsValidParams {
  value: any;
  isRequired?: boolean;
}

export class BooleanValidator {
  static isValid = (params: IsValidParams): true | string => {
    const { value, isRequired = false } = params;

    if (value === undefined && isRequired) return 'property is required';

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
