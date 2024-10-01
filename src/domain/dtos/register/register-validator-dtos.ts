import { CreateRegister, UpdateRegister } from '@domain/interfaces';
import {
  DateValidator,
  NumberValidator,
  StringValidator,
} from '@domain/type-validators';
import { variables } from '@domain/variables';

export class RegisterValidator {
  static create(object: CreateRegister): string[] {
    const errors: string[] = [];
    const { guestsNumber, discount, price, userId, roomId, checkOut } = object;

    // * guestsNumber
    if (guestsNumber !== undefined) {
      const guestsNumberMinValueValid = NumberValidator.isMinValue({
        value: guestsNumber,
        minValue: variables.GUESTS_NUMBER_MIN_VALUE,
      });
      if (guestsNumberMinValueValid !== true) {
        errors.push(`guestsNumber ${guestsNumberMinValueValid}`);
      }
    }

    // * discount
    const discountValid = NumberValidator.isPositive(discount);
    if (discountValid !== true) {
      errors.push(`discount ${discountValid}`);
    }

    // * price
    const priceValid = NumberValidator.isPositive(price);
    if (priceValid !== true) {
      errors.push(`price ${priceValid}`);
    }

    // * userId
    const userIdValid = StringValidator.isValidUUID(userId);
    if (userIdValid !== true) {
      errors.push(`userId ${userIdValid}`);
    }

    // * roomId
    const roomIdValid = StringValidator.isValidUUID(roomId);
    if (roomIdValid !== true) {
      errors.push(`roomId ${roomIdValid}`);
    }

    // * checkOut
    if (checkOut !== undefined) {
      const checkOutValid = DateValidator.isValid(checkOut);
      if (checkOutValid !== true) {
        errors.push(`checkOut ${checkOutValid}`);
      }
    }

    return errors;
  }

  static update(object: UpdateRegister): string[] {
    const errors: string[] = [];
    const { id, guestsNumber, discount, price, userId, roomId, checkOut } =
      object;

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) {
      errors.push(`id ${idValid}`);
    }

    // * guestsNumber
    if (guestsNumber !== undefined) {
      const guestsNumberMinValueValid = NumberValidator.isMinValue({
        value: guestsNumber,
        minValue: variables.GUESTS_NUMBER_MIN_VALUE,
      });
      if (guestsNumberMinValueValid !== true) {
        errors.push(`guestsNumber ${guestsNumberMinValueValid}`);
      }
    }

    // * discount
    if (discount !== undefined) {
      const discountValid = NumberValidator.isPositive(discount);
      if (discountValid !== true) {
        errors.push(`discount ${discountValid}`);
      }
    }

    // * price
    if (price !== undefined) {
      const priceValid = NumberValidator.isPositive(price);
      if (priceValid !== true) {
        errors.push(`price ${priceValid}`);
      }
    }

    // * userId
    if (userId !== undefined) {
      const userIdValid = StringValidator.isValidUUID(userId);
      if (userIdValid !== true) {
        errors.push(`userId ${userIdValid}`);
      }
    }

    // * roomId
    if (roomId !== undefined) {
      const roomIdValid = StringValidator.isValidUUID(roomId);
      if (roomIdValid !== true) {
        errors.push(`roomId ${roomIdValid}`);
      }
    }

    // * checkOut
    if (checkOut !== undefined) {
      const checkOutValid = DateValidator.isValid(checkOut);
      if (checkOutValid !== true) {
        errors.push(`checkOut ${checkOutValid}`);
      }
    }

    return errors;
  }
}
