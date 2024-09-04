interface MostBeParams {
  value: string;
  allowValues: string[];
}

export class StringValidator {
  static isValid = (value: any): true | string => {
    if (value === undefined) return 'property is required';

    if (value === '') return 'property cannot be empty';

    if (typeof value !== 'string') return 'property most be a string';

    return true;
  };

  static mostBe = (params: MostBeParams): true | string => {
    const { value, allowValues } = params;

    const isValidString = StringValidator.isValid(value);
    if (isValidString !== true) return isValidString;

    if (!allowValues.some((element) => element === value))
      return 'most be: ' + allowValues.join(', ');
    return true;
  };

  static isValidUUID(id: string) {
    const validId = StringValidator.isValid(id);

    if (typeof validId === 'string') {
      return validId;
    }

    const uuidRegex_v4 =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    return uuidRegex_v4.test(id) ? true : 'is not a valid uuid';
  }
}
