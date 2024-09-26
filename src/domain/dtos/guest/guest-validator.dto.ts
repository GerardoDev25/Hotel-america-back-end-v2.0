import { CreateGuest, UpdateGuest } from '@domain/interfaces';
import {
  DateValidator,
  NumberValidator,
  StringValidator,
} from '@domain/type-validators';
import { variables } from '@src/domain/variables';

export class GuestValidator {
  static create(object: CreateGuest) {
    const errors: string[] = [];
    const {
      di,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
      dateOfBirth,
      checkIn,
      checkOut,
    } = object;

    // * di
    const diMinValueValid = StringValidator.isValid(di);
    if (diMinValueValid !== true) {
      errors.push(`di ${diMinValueValid}`);
    }

    // * city
    const cityMinValueValid = StringValidator.isValid(city);
    if (cityMinValueValid !== true) {
      errors.push(`city ${cityMinValueValid}`);
    }

    // * name
    const nameMinValueValid = StringValidator.isValid(name);
    if (nameMinValueValid !== true) {
      errors.push(`name ${nameMinValueValid}`);
    }

    // * lastName
    const lastNameMinValueValid = StringValidator.isValid(lastName);
    if (lastNameMinValueValid !== true) {
      errors.push(`lastName ${lastNameMinValueValid}`);
    }

    // * phone
    const phoneMinValueValid = StringValidator.isValidPhoneNumber(phone);
    if (phoneMinValueValid !== true) {
      errors.push(`phone ${phoneMinValueValid}`);
    }

    // * roomNumber
    const roomNumberMinValueValid = NumberValidator.isMinValue({
      value: roomNumber,
      minValue: variables.ROOM_NUMBER_MIN_VALUE,
    });
    if (roomNumberMinValueValid !== true) {
      errors.push(`roomNumber ${roomNumberMinValueValid}`);
    }

    //  * countryId
    const countryIdValid = StringValidator.isValid(countryId);
    if (countryIdValid !== true) {
      errors.push(`countryId ${countryIdValid}`);
    }
    if (countryId?.length !== 2) {
      errors.push(`countryId not valid`);
    }

    //  * registerId
    const registerIdValid = StringValidator.isValidUUID(registerId);
    if (registerIdValid !== true) {
      errors.push(`registerId ${registerIdValid}`);
    }

    //  * dateOfBirth
    const dateOfBirthValid = DateValidator.isValid(dateOfBirth);
    if (dateOfBirthValid !== true) {
      errors.push(`dateOfBirth ${dateOfBirthValid}`);
    }

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

  static update(object: UpdateGuest) {
    const errors: string[] = [];
    const {
      di,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
      dateOfBirth,
      checkIn,
      checkOut,
    } = object;

    // * di
    if (di !== undefined) {
      const diMinValueValid = StringValidator.isValid(di);
      if (diMinValueValid !== true) {
        errors.push(`di ${diMinValueValid}`);
      }
    }

    // * city
    if (city !== undefined) {
      const cityMinValueValid = StringValidator.isValid(city);
      if (cityMinValueValid !== true) {
        errors.push(`city ${cityMinValueValid}`);
      }
    }

    // * name
    if (name !== undefined) {
      const nameMinValueValid = StringValidator.isValid(name);
      if (nameMinValueValid !== true) {
        errors.push(`name ${nameMinValueValid}`);
      }
    }

    // * lastName
    if (lastName !== undefined) {
      const lastNameMinValueValid = StringValidator.isValid(lastName);
      if (lastNameMinValueValid !== true) {
        errors.push(`lastName ${lastNameMinValueValid}`);
      }
    }

    // * phone
    if (phone !== undefined) {
      const phoneMinValueValid = StringValidator.isValidPhoneNumber(phone);
      if (phoneMinValueValid !== true) {
        errors.push(`phone ${phoneMinValueValid}`);
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

    // * countryId
    if (countryId !== undefined) {
      const countryIdValid = StringValidator.isValid(countryId);
      if (countryIdValid !== true) {
        errors.push(`countryId ${countryIdValid}`);
      }
      if (countryId?.length !== 2) {
        errors.push(`countryId not valid`);
      }
    }

    // * registerId
    if (registerId !== undefined) {
      const registerIdValid = StringValidator.isValidUUID(registerId);
      if (registerIdValid !== true) {
        errors.push(`registerId ${registerIdValid}`);
      }
    }

    // * dateOfBirth
    if (dateOfBirth !== undefined) {
      const dateOfBirthValid = DateValidator.isValid(dateOfBirth);
      if (dateOfBirthValid !== true) {
        errors.push(`dateOfBirth ${dateOfBirthValid}`);
      }
    }

    // * checkIn
    if (checkIn !== undefined) {
      const checkInValid = DateValidator.isValid(checkIn);
      if (checkInValid !== true) {
        errors.push(`checkIn ${checkInValid}`);
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
