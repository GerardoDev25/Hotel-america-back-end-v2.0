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

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(id) ? true : 'is not a valid id';
  }
}
