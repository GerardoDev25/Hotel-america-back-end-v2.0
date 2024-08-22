import { CustomError } from './error.custom';

describe('error.custom.ts', () => {
  // Creating a CustomError instance with a status code and message
  it('should create a CustomError instance with the given status code and message', () => {
    // Arrange
    const statusCodeObjet = {
      badRequest: 400,
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      conflict: 409,
      internalServerError: 500,
    };

    enum statusCodeEnum {
      badRequest = 'badRequest',
      unauthorized = 'unauthorized',
      forbidden = 'forbidden',
      notFound = 'notFound',
      conflict = 'conflict',
      internalServerError = 'internalServerError',
    }

    const statusCodeArray = Object.entries(statusCodeObjet);

    statusCodeArray.forEach(([key, status]) => {
      const error = CustomError[key as statusCodeEnum](key);

      expect(error).toBeInstanceOf(CustomError);
      expect(error.statusCode).toBe(status);
      expect(error.message).toBe(key);
    });
  });
});
