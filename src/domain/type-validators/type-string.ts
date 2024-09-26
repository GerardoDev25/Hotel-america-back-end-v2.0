interface MostBeParams {
  value: string;
  allowValues: string[];
}

export class StringValidator {
  static isValid = (value: any): true | string => {
    if (value === undefined) return 'property is required';

    if (typeof value !== 'string') return 'property most be a string';

    if (value.trim().length === 0) return 'property is empty';

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

  static isJWT(token: string): boolean {
    if (typeof StringValidator.isValid(token) === 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const base64urlPattern = /^[A-Za-z0-9_-]+$/;

    const [header, payload, signature] = parts;

    return (
      base64urlPattern.test(header) &&
      base64urlPattern.test(payload) &&
      base64urlPattern.test(signature)
    );
  }

  static isValidPhoneNumber(phone: string): true | string {
    const isValidString = StringValidator.isValid(phone);
    if (isValidString !== true) return isValidString;

    const phoneRegex = /^\+\d{10,15}$/;

    return phoneRegex.test(phone) ? true : 'property most have a valid format';
  }
}
