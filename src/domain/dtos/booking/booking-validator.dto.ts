import {
  CreateBooking,
  FilterBooking,
  UpdateBooking,
} from '@domain/interfaces';
import {
  DateValidator,
  NumberValidator,
  StringValidator,
} from '@domain/type-validators';
import { variables } from '@src/domain/variables';

export class BookingValidator {
  static create(object: CreateBooking) {
    const errors: string[] = [];
    const {
      amount,
      checkIn,
      description,
      guestsNumber,
      name,
      checkOut,
      roomNumber,
    } = object;

    // * amount
    const amountValid = NumberValidator.isPositive(amount);
    if (amountValid !== true) {
      errors.push(`amount ${amountValid}`);
    }

    // * guestsNumber
    const guestsNumberValid = NumberValidator.isPositive(guestsNumber);
    if (guestsNumberValid !== true) {
      errors.push(`guestsNumber ${guestsNumberValid}`);
    }

    // * roomNumber
    if (roomNumber !== undefined) {
      const roomNumberValid = NumberValidator.isPositive(roomNumber);
      if (roomNumberValid !== true) {
        errors.push(`roomNumber ${roomNumberValid}`);
      }
    }

    // * name
    const nameMinValueValid = StringValidator.isValid(name);
    if (nameMinValueValid !== true) {
      errors.push(`name ${nameMinValueValid}`);
    }

    // * description
    const descriptionValid = StringValidator.isValid(description);
    if (descriptionValid !== true)
      errors.push('description ' + descriptionValid);

    // * checkIn
    const checkInValid = DateValidator.isValid(checkIn);
    if (checkInValid !== true) {
      errors.push(`checkIn ${checkInValid}`);
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
  static filter(object: FilterBooking) {
    const errors: string[] = [];

    const {
      amount,
      checkIn,
      checkOut,
      createdAt,
      guestsNumber,
      name,
      roomNumber,
    } = object;

    // * amount
    if (amount !== undefined) {
      const amountValid = NumberValidator.isPositive(amount);
      if (amountValid !== true) {
        errors.push(`amount ${amountValid}`);
      }
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

    // * name
    if (name !== undefined) {
      const nameMinValueValid = StringValidator.isValid(name);
      if (nameMinValueValid !== true) {
        errors.push(`name ${nameMinValueValid}`);
      }
    }

    // * roomNumber
    if (roomNumber !== undefined) {
      const roomNumberMinValueValid = NumberValidator.isMinValue({
        value: roomNumber,
        minValue: variables.ROOM_NUMBER_MIN_VALUE,
      });
      if (roomNumberMinValueValid !== true) {
        errors.push(`roomNumber ${roomNumberMinValueValid}`);
      }
    }

    // * checkOut
    if (checkOut !== undefined) {
      const checkOutValid = DateValidator.isValid(checkOut);
      if (checkOutValid !== true) {
        errors.push(`checkOut ${checkOutValid}`);
      }
    }

    // * checkIn
    if (checkIn !== undefined) {
      const checkInValid = DateValidator.isValid(checkIn);
      if (checkInValid !== true) {
        errors.push(`checkIn ${checkInValid}`);
      }
    }

    // * createdAt
    if (createdAt !== undefined) {
      const createdAtValid = DateValidator.isValid(createdAt);
      if (createdAtValid !== true) {
        errors.push(`createdAt ${createdAtValid}`);
      }
    }

    return errors;
  }

  static update(object: UpdateBooking): string[] {
    const { id, description, ...rest } = object;

    const errors: string[] = BookingValidator.filter(rest);

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) {
      errors.push(`id ${idValid}`);
    }

    // * description
    if (description !== undefined) {
      const descriptionMinValueValid = StringValidator.isValid(description);
      if (descriptionMinValueValid !== true) {
        errors.push(`description ${descriptionMinValueValid}`);
      }
    }
    return errors;
  }
}
