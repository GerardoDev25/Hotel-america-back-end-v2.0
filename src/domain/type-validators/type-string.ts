interface MostBeParams {
  value: string;
  allowValues: string[];
}

export class StringValidator {
  static isValid = (value: any): true | string => {
    if (value === undefined) return 'property is required';

    if (typeof value !== 'string') return 'property most be a string';

    return true;
  };

  static mostBe = (params: MostBeParams): true | string => {
    const { value, allowValues } = params;

    const isValidString = StringValidator.isValid(value);
    if (isValidString !== true) return isValidString;

    if (!allowValues.some((element) => element === value))
      return 'most be normal or suit';
    return true;
  };
}
