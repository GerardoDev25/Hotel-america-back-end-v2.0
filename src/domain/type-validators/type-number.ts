// interface IsValidParams {
//   value: any;
//   isRequired?: boolean;
// }

interface MinValueParams {
  value: number;
  minValue: number;
}

export class NumberValidator {
  static isValid = (value: any): true | string => {
    // const { value, isRequired = false } = params;
    const exertionLists = ['', false, true];

    if (value === undefined) {
      return 'property is required';
    }

    if (isNaN(value)) return 'property most be a number';

    if (exertionLists.some((element) => element === value))
      return 'property most be a number';

    return true;
  };

  static isMinValue = ({ value, minValue }: MinValueParams): true | string => {
    const isValidNumber = NumberValidator.isValid(value);

    if (isValidNumber !== true) return isValidNumber;

    if (value < minValue)
      return 'property most be a greater than or equal to ' + minValue;

    return true;
  };

  static isPositive = (value: number): true | string => {
    const isValidNumber = NumberValidator.isValid(value);
    if (isValidNumber !== true) return isValidNumber;

    if (value < 0) return 'property most be a positive';

    return true;
  };
}