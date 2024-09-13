export class DateValidator {
  static isValid = (value: any): true | string => {
    if (value === undefined) return 'property is required';

    if (typeof value !== 'string' && typeof value !== 'object')
      return 'property type not allow';

    if (!DateValidator.isValidDateFormat(value))
      return 'property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format';
    return true;
  };

  static isValidDateFormat(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    if (!dateRegex.test(dateString) && !isoRegex.test(dateString)) {
      return false;
    }

    const datePart = dateString.split('T')[0];

    const [year, month, day] = datePart.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  static toDate = (value: any): Date | null => {
    const isValid = DateValidator.isValid(value);
    if (isValid !== true) return null;
    return new Date(value);
  };
}
