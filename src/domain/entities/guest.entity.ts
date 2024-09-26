import { IGuest } from '@domain/interfaces';
import { variables } from '@domain/variables';
import { CustomError } from '@domain/error';
import {
  StringValidator,
  NumberValidator,
  DateValidator,
} from '@domain/type-validators';

export class GuestEntity implements IGuest {
  id: string;
  di: string;
  checkIn: string;
  checkOut?: string | undefined;
  dateOfBirth: string;
  city: string;
  name: string;
  lastName: string;
  phone: string;
  roomNumber: number;
  countryId: string;
  registerId: string;

  constructor(params: IGuest) {
    this.id = params.id;
    this.di = params.di;
    this.checkIn = params.checkIn;
    this.checkOut = params.checkOut;
    this.dateOfBirth = params.dateOfBirth;
    this.city = params.city;
    this.name = params.name;
    this.lastName = params.lastName;
    this.phone = params.phone;
    this.roomNumber = params.roomNumber;
    this.countryId = params.countryId;
    this.registerId = params.registerId;
  }

  private static verifyProperties(properties: IGuest) {
    const {
      id,
      di,
      checkIn,
      checkOut,
      dateOfBirth,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
    } = properties;

    // * id
    const idValidation = StringValidator.isValidUUID(id);
    if (idValidation !== true) {
      throw CustomError.badRequest('id ' + idValidation);
    }

    // * di
    const diMinValueValid = StringValidator.isValid(di);
    if (diMinValueValid !== true) {
      throw CustomError.badRequest('di ' + diMinValueValid);
    }

    // * city
    const cityMinValueValid = StringValidator.isValid(city);
    if (cityMinValueValid !== true) {
      throw CustomError.badRequest('city ' + cityMinValueValid);
    }

    // * name
    const nameMinValueValid = StringValidator.isValid(name);
    if (nameMinValueValid !== true) {
      throw CustomError.badRequest('name ' + nameMinValueValid);
    }

    // * lastName
    const lastNameMinValueValid = StringValidator.isValid(lastName);
    if (lastNameMinValueValid !== true) {
      throw CustomError.badRequest('lastName ' + lastNameMinValueValid);
    }

    // * phone
    const phoneMinValueValid = StringValidator.isValidPhoneNumber(phone);
    if (phoneMinValueValid !== true) {
      throw CustomError.badRequest('phone ' + phoneMinValueValid);
    }

    // * roomNumber
    const roomNumberMinValueValid = NumberValidator.isMinValue({
      value: roomNumber,
      minValue: variables.ROOM_NUMBER_MIN_VALUE,
    });
    if (roomNumberMinValueValid !== true) {
      throw CustomError.badRequest('roomNumber ' + roomNumberMinValueValid);
    }

    //  * countryId
    const countryIdValid = StringValidator.isValid(countryId);
    if (countryIdValid !== true) {
      throw CustomError.badRequest('countryId ' + countryIdValid);
    }
    if (countryId?.length !== 2) {
      // eslint-disable-next-line quotes
      throw CustomError.badRequest("countryId isn't valid");
    }

    //  * registerId
    const registerIdValid = StringValidator.isValidUUID(registerId);
    if (registerIdValid !== true) {
      throw CustomError.badRequest('registerId ' + registerIdValid);
    }

    //  * dateOfBirth
    const dateOfBirthValid = DateValidator.isValid(dateOfBirth);
    if (dateOfBirthValid !== true) {
      throw CustomError.badRequest('dateOfBirth ' + dateOfBirthValid);
    }

    // * checkIn
    const checkInValid = DateValidator.isValid(checkIn);
    if (checkInValid !== true) {
      throw CustomError.badRequest('checkIn ' + checkInValid);
    }

    // * checkOut
    if (checkOut !== undefined) {
      const checkOutValid = DateValidator.isValid(checkOut);
      if (checkOutValid !== true) {
        throw CustomError.badRequest('checkOut ' + checkOutValid);
      }
    }
  }

  static fromObject(object: Record<string, any>): GuestEntity {
    const {
      id,
      di,
      checkIn,
      checkOut,
      dateOfBirth,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
    } = object;

    this.verifyProperties({
      id,
      di,
      checkIn,
      checkOut,
      dateOfBirth,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
    });

    const dateOfBirthValid =
      new Date(dateOfBirth).toISOString().split('T').at(0) ?? dateOfBirth;

    const checkInValid =
      new Date(checkIn).toISOString().split('T').at(0) ?? checkIn;

    const checkOutValid = checkOut
      ? new Date(checkOut).toISOString().split('T').at(0)
      : undefined;

    return new GuestEntity({
      id,
      di,
      city,
      name,
      lastName,
      phone,
      roomNumber,
      countryId,
      registerId,
      checkIn: checkInValid,
      checkOut: checkOutValid,
      dateOfBirth: dateOfBirthValid,
    });
  }
}
