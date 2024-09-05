export class DateValidator {
  static isValid = (value: any): true | string => {
    if (value === undefined) return 'property is required';

    if (value === '') return 'property cannot be empty';

    const date = new Date(value);

    return !isNaN(date.getTime()) ? true : 'property most be a valid date';
  };

  static toDate = (value: any): Date | null => {
    const date = new Date(value);

    return !isNaN(date.getTime()) ? date : null;
  };
}
